const express = require('express');
const {
    createMeetingEnquiry,
    getMeetingEnquiries
} = require('../controllers/meetingEnquiryController');

const router = express.Router();

router
    .route('/')
    .post(createMeetingEnquiry)
    .get(getMeetingEnquiries); 

module.exports = router;