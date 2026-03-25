const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validator");
const { protect, authorize } = require("../middlewares/auth");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  resetAdminPassword,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin,
} = require("../controllers/authController");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

// Public routes
router.post("/login", loginValidation, validate, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  changePassword,
);

// Super admin only routes
router.post(
  "/register",
  protect,
  authorize("super_admin"),
  registerValidation,
  validate,
  register,
);
router.get("/admins", protect, authorize("super_admin"), getAllAdmins);
router.put(
  "/admins/:id/status",
  protect,
  authorize("super_admin"),
  updateAdminStatus,
);
router.put(
  "/admins/:id/reset-password",
  protect,
  authorize("super_admin"),
  resetPasswordValidation,
  validate,
  resetAdminPassword,
);
router.delete("/admins/:id", protect, authorize("super_admin"), deleteAdmin);

module.exports = router;
