const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const { sendSuccess } = require("./utils/responseHandler");
const { apiLimiter, authLimiter } = require("./middlewares/rateLimiter");
const mongoSanitize = require("./middlewares/mongoSanitize");
const requestLogger = require("./middlewares/requestLogger");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Route Files
const inquiryRoutes = require("./routes/inquiryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const authRoutes = require("./routes/authRoutes");
const careerRoutes = require("./routes/careerRoutes");
const blogRoutes = require("./routes/blogRoutes");
const offerRoutes = require("./routes/offerRoutes");

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
// Custom MongoDB sanitization (Express v5 compatible)
app.use(mongoSanitize);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request/response logs for API debugging
app.use(requestLogger);

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Apply strict rate limiting to auth routes
app.use("/api/v1/auth/login", authLimiter);

// Mount Routes
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/careers", careerRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/offers", offerRoutes);

// Health check endpoint
app.get("/api/v1", (req, res) => {
  sendSuccess(res, null, "Welcome to the Hotel Template API v1!");
});

// Default 404 handler for undefined routes
app.use(notFound);

// Centralized Error Handling Middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
