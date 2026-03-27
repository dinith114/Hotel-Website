const MeetingEnquiry = require("../models/MeetingEnquiry");
const { sendSuccess } = require("../utils/responseHandler");

/**
 * @desc    Create a new meeting enquiry
 * @route   POST /api/v1/meeting-enquiries
 * @access  Public
 */
exports.createMeetingEnquiry = async (req, res, next) => {
  try {
    const meetingEnquiry = await MeetingEnquiry.create(req.body);

    sendSuccess(
      res,
      meetingEnquiry,
      "Meeting enquiry submitted successfully!",
      201,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all meeting enquiries
 * @route   GET /api/v1/meeting-enquiries
 * @access  Private
 */
exports.getMeetingEnquiries = async (req, res, next) => {
  try {
    const meetingEnquiries = await MeetingEnquiry.find().sort("-createdAt");

    sendSuccess(
      res,
      { count: meetingEnquiries.length, data: meetingEnquiries },
      "Meeting enquiries retrieved successfully",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update meeting enquiry status
 * @route   PUT /api/v1/meeting-enquiries/:id/status
 * @access  Private
 */
exports.updateMeetingEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "resolved"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const meetingEnquiry = await MeetingEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!meetingEnquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting enquiry not found" });
    }

    sendSuccess(res, meetingEnquiry, `Meeting enquiry marked as ${status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete meeting enquiry (only if resolved)
 * @route   DELETE /api/v1/meeting-enquiries/:id
 * @access  Private
 */
exports.deleteMeetingEnquiry = async (req, res, next) => {
  try {
    const meetingEnquiry = await MeetingEnquiry.findById(req.params.id);

    if (!meetingEnquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting enquiry not found" });
    }

    if (meetingEnquiry.status !== "resolved") {
      return res.status(400).json({
        success: false,
        message: "Only resolved meeting enquiries can be deleted",
      });
    }

    await meetingEnquiry.deleteOne();
    sendSuccess(res, null, "Meeting enquiry deleted successfully.");
  } catch (error) {
    next(error);
  }
};
