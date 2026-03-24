// Custom security middleware for Express v5 compatibility
// Prevents NoSQL injection and XSS attacks

const sanitize = (obj) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      // Remove keys with $ or . to prevent NoSQL injection
      if (key.includes("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "string") {
        // XSS protection: Remove script tags and dangerous HTML
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, ""); // Remove event handlers like onclick=
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
  }
  return obj;
};

const securityMiddleware = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body) {
      req.body = sanitize(req.body);
    }

    // Sanitize params
    if (req.params) {
      req.params = sanitize(req.params);
    }

    // Sanitize query (Express v5 compatible)
    if (req.query && typeof req.query === "object") {
      const queryObj = { ...req.query };
      const sanitized = sanitize(queryObj);

      // Update query with sanitized version
      for (const key in req.query) {
        delete req.query[key];
      }
      Object.assign(req.query, sanitized);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = securityMiddleware;
