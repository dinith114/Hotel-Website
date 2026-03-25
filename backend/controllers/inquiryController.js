const Inquiry = require('../models/Inquiry');
const { sendSuccess } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a new inquiry (Contact Form)
// @route   POST /api/v1/inquiries
// @access  Public
exports.createInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.create(req.body);

        // --- EMAIL AUTOMATION ---
        try {
            // 1. Send Auto-Reply to User
             const autoReplyHtml = `
                 <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                     <h2 style="color: #2196F3;">Message Received!</h2>
                     <p>Dear ${inquiry.name},</p>
                     <p>Thank you for reaching out to us. We have received your message regarding: <em>"${inquiry.message.substring(0, 50)}..."</em></p>
                     <p>Our team will get back to you as soon as possible.</p>
                     <p style="font-size: 12px; color: #888;">Warm Regards, Hotel Support Team</p>
                 </div>
             `;
             await sendEmail({
                 email: inquiry.email, // Send to the user's email
                 subject: 'Thank You for Contacting Us - Hotel Support',
                 message: autoReplyHtml
             });

             // 2. Alert Hotel Admin
             const adminAlertHtml = `
                 <div style="font-family: Arial, sans-serif; border-left: 4px solid #f44336; padding-left: 15px;">
                     <h2>🚨 New Contact Us Inquiry!</h2>
                     <p><strong>Name:</strong> ${inquiry.name}</p>
                     <p><strong>Email:</strong> ${inquiry.email}</p>
                     <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
                     <br/>
                     <p><strong>Message:</strong></p>
                     <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                         ${inquiry.message}
                     </div>
                 </div>
             `;
             await sendEmail({
                 email: process.env.SMTP_EMAIL, // Send to the hotel's admin email
                 subject: `NEW INQUIRY: ${inquiry.name}`,
                 message: adminAlertHtml
             });
             
        } catch (err) {
            console.error('Email could not be sent:', err);
        }

        sendSuccess(res, inquiry, 'Your message has been sent successfully.', 201);
    } catch (error) {
        next(error); // Passes the error to our custom centralized errorHandler
    }
};

// @desc    Get all inquiries (For Admin, Optional for now)
// @route   GET /api/v1/inquiries
// @access  Private (Needs auth later)
exports.getInquiries = async (req, res, next) => {
    try {
        const inquiries = await Inquiry.find().sort('-createdAt');
        sendSuccess(res, inquiries, 'Inquiries fetched successfully.');
    } catch (error) {
        next(error);
    }
};

// @desc    Update inquiry status
// @route   PUT /api/v1/inquiries/:id/status
// @access  Private (Admin only)
exports.updateInquiryStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        // Ensure status is valid before querying the database
        const validStatuses = ['pending', 'reviewed', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        sendSuccess(res, inquiry, `Inquiry marked as ${status}`);
    } catch (error) {
        next(error);
    }
};
