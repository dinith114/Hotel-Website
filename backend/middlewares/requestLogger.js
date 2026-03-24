const { randomUUID } = require("crypto");
const pino = require("pino");
const pinoHttp = require("pino-http");

const SENSITIVE_FIELDS = new Set([
  "password",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "jwt",
  "secret",
  "smtp_password",
]);

const MAX_LOG_LENGTH = Number(process.env.API_LOGGER_MAX_LENGTH || 1000);
const SHOULD_LOG_BODY =
  process.env.API_LOGGER_BODY === "true" ||
  process.env.NODE_ENV !== "production";
const USE_PRETTY_LOGS =
  process.env.API_LOGGER_PRETTY === "true" ||
  process.env.NODE_ENV !== "production";
const LOG_RESPONSE_BODY = process.env.API_LOGGER_RESPONSE_BODY === "true";

const transport = USE_PRETTY_LOGS
  ? pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname,req,res,request,response,service",
        levelFirst: true,
      },
    })
  : undefined;

const logger = pino(
  {
    level: process.env.API_LOGGER_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      service: "hotel-backend",
    },
  },
  transport,
);

const httpLogger = pinoHttp({
  logger,
  autoLogging: false,
  quietReqLogger: true,
  quietResLogger: true,
  genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
});

const sanitizePayload = (value, seen = new WeakSet()) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return value.length > MAX_LOG_LENGTH
      ? `${value.slice(0, MAX_LOG_LENGTH)}... [truncated]`
      : value;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizePayload(item, seen));
  }

  const result = {};

  for (const [key, val] of Object.entries(value)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
      continue;
    }

    result[key] = sanitizePayload(val, seen);
  }

  return result;
};

const hasKeys = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0;

const buildRequestLog = (req) => {
  const requestLog = {
    id: req.id,
    method: req.method,
    path: req.originalUrl || req.url,
    ip: req.ip || req.socket?.remoteAddress || "unknown",
  };

  if (SHOULD_LOG_BODY && hasKeys(req.query)) {
    requestLog.query = sanitizePayload(req.query);
  }

  if (SHOULD_LOG_BODY && hasKeys(req.params)) {
    requestLog.params = sanitizePayload(req.params);
  }

  if (SHOULD_LOG_BODY && hasKeys(req.body)) {
    requestLog.body = sanitizePayload(req.body);
  }

  return requestLog;
};

const requestLogger = (req, res, next) => {
  if (process.env.API_LOGGER_ENABLED === "false") {
    return next();
  }

  httpLogger(req, res, () => {
    const start = process.hrtime.bigint();
    let responseBody;

    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.json = (body) => {
      responseBody = body;
      return originalJson(body);
    };

    res.send = (body) => {
      if (responseBody === undefined) {
        responseBody = body;
      }
      return originalSend(body);
    };

    const requestPath = req.originalUrl || req.url;
    const requestLog = buildRequestLog(req);
    req.log.info(
      {
        id: requestLog.id,
        method: requestLog.method,
        path: requestLog.path,
        ip: requestLog.ip,
      },
      `--> ${req.method} ${requestPath}`,
    );

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      const responseLog = {
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
      };

      if (SHOULD_LOG_BODY && LOG_RESPONSE_BODY && responseBody !== undefined) {
        responseLog.body = sanitizePayload(responseBody);
      }

      const level =
        res.statusCode >= 500
          ? "error"
          : res.statusCode >= 400
            ? "warn"
            : "info";

      req.log[level](
        {
          id: req.id,
          method: req.method,
          path: requestPath,
          statusCode: responseLog.statusCode,
          durationMs: responseLog.durationMs,
          ...(responseLog.body ? { body: responseLog.body } : {}),
        },
        `<-- ${res.statusCode} ${req.method} ${requestPath} (${responseLog.durationMs}ms)`,
      );
    });

    next();
  });
};

module.exports = requestLogger;
