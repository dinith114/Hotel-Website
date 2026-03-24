const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const { submissionLimiter } = require("../middlewares/rateLimiter");
const {
  getCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer,
  getCareerStats,
} = require("../controllers/careerController");
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} = require("../controllers/jobApplicationController");

const router = express.Router();

// Validation rules
const careerValidation = [
  body("title").notEmpty().withMessage("Job title is required").trim(),
  body("department").notEmpty().withMessage("Department is required"),
  body("location").notEmpty().withMessage("Location is required").trim(),
  body("employmentType").notEmpty().withMessage("Employment type is required"),
  body("description").notEmpty().withMessage("Job description is required"),
  body("requirements").notEmpty().withMessage("Job requirements are required"),
];

const applicationValidation = [
  body("firstName").notEmpty().withMessage("First name is required").trim(),
  body("lastName").notEmpty().withMessage("Last name is required").trim(),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone").notEmpty().withMessage("Phone number is required").trim(),
  body("address.country").notEmpty().withMessage("Country is required"),
  body("education").notEmpty().withMessage("Education details are required"),
  body("experience").notEmpty().withMessage("Work experience is required"),
  body("coverLetter")
    .notEmpty()
    .withMessage("Cover letter is required")
    .isLength({ max: 2000 })
    .withMessage("Cover letter cannot exceed 2000 characters"),
];

// Career routes
router.get("/stats/overview", protect, getCareerStats);
router.get("/", getCareers);
router.get("/:id", getCareerById);
router.post("/", protect, careerValidation, validate, createCareer);
router.put("/:id", protect, careerValidation, validate, updateCareer);
router.delete("/:id", protect, deleteCareer);

// Job application routes
router.post(
  "/:careerId/apply",
  submissionLimiter,
  applicationValidation,
  validate,
  submitApplication,
);

// Admin application management routes (separate router might be better, but keeping together for simplicity)
router.get("/applications/stats/overview", protect, getApplicationStats);
router.get("/applications/all", protect, getApplications);
router.get("/applications/:id", protect, getApplicationById);
router.put("/applications/:id/status", protect, updateApplicationStatus);
router.delete("/applications/:id", protect, deleteApplication);

module.exports = router;
