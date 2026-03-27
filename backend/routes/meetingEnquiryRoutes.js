const express = require("express");
const {
  createMeetingEnquiry,
  getMeetingEnquiries,
  updateMeetingEnquiryStatus,
  deleteMeetingEnquiry,
} = require("../controllers/meetingEnquiryController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(createMeetingEnquiry).get(getMeetingEnquiries);

router
  .route("/:id/status")
  .put(protect, authorize("admin", "super_admin"), updateMeetingEnquiryStatus);

router
  .route("/:id")
  .delete(protect, authorize("admin", "super_admin"), deleteMeetingEnquiry);

module.exports = router;
