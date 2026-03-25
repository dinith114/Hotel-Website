const MeetingEnquiry = require('../models/MeetingEnquiry');
const { sendSuccess } = require('../utils/responseHandler');

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
            'Meeting enquiry submitted successfully!',
            201
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
        const meetingEnquiries = await MeetingEnquiry.find().sort('-createdAt');

        sendSuccess(
            res,
            { count: meetingEnquiries.length, data: meetingEnquiries },
            'Meeting enquiries retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};