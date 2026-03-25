const rateLimit = require("express-rate-limit");

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const apiWindowMs = toPositiveInt(
  process.env.API_RATE_LIMIT_WINDOW,
  15 * 60 * 1000,
);
const apiMax = toPositiveInt(process.env.API_RATE_LIMIT_MAX, 100);
const authWindowMs = toPositiveInt(
  process.env.AUTH_RATE_LIMIT_WINDOW,
  15 * 60 * 1000,
);
const authMax = toPositiveInt(process.env.AUTH_RATE_LIMIT_MAX, 5);
const submissionWindowMs = toPositiveInt(
  process.env.SUBMISSION_RATE_LIMIT_WINDOW,
  60 * 60 * 1000,
);
const submissionMax = toPositiveInt(process.env.SUBMISSION_RATE_LIMIT_MAX, 10);

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: apiWindowMs,
  max: apiMax,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes
exports.authLimiter = rateLimit({
  windowMs: authWindowMs,
  max: authMax,
  message: "Too many login attempts, please try again after 15 minutes",
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate rate limiter for public submission forms
exports.submissionLimiter = rateLimit({
  windowMs: submissionWindowMs,
  max: submissionMax,
  message: "Too many submissions from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
