const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validator");
const { protect } = require("../middlewares/auth");
const {
  getOffers,
  getOfferByIdentifier,
  validateOfferCode,
  createOffer,
  updateOffer,
  deleteOffer,
  incrementOfferUsage,
  getOfferStats,
} = require("../controllers/offerController");

const router = express.Router();

// Validation rules
const offerValidation = [
  body("title")
    .notEmpty()
    .withMessage("Offer title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters")
    .trim(),
  body("description").notEmpty().withMessage("Description is required"),
  body("offerType").notEmpty().withMessage("Offer type is required"),
  body("validFrom")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Valid start date is required"),
  body("validTo")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Valid end date is required"),
  body("termsAndConditions")
    .notEmpty()
    .withMessage("Terms and conditions are required"),
];

const validateCodeValidation = [
  body("code").notEmpty().withMessage("Offer code is required").trim(),
];

// Public routes
router.get("/stats/overview", protect, getOfferStats);
router.get("/", getOffers);
router.get("/:identifier", getOfferByIdentifier);
router.post("/validate", validateCodeValidation, validate, validateOfferCode);

// Admin routes
router.post("/", protect, offerValidation, validate, createOffer);
router.put("/:id", protect, offerValidation, validate, updateOffer);
router.delete("/:id", protect, deleteOffer);
router.put("/:id/use", protect, incrementOfferUsage);

module.exports = router;
