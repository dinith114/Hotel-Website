const express = require('express');
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin', 'super_admin'), getInquiries)    // Admin: View all
    .post(createInquiry); // Public: People filling the form

router.route('/:id/status')
    .put(protect, authorize('admin', 'super_admin'), updateInquiryStatus); // Admin: Update status

module.exports = router;
