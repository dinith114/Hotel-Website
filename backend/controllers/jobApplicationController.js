const JobApplication = require("../models/JobApplication");
const Career = require("../models/Career");
const { sendSuccess } = require("../utils/responseHandler");
const nodemailer = require("nodemailer");

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// @desc    Submit job application
// @route   POST /api/v1/careers/:careerId/apply
// @access  Public
exports.submitApplication = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.careerId);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    if (career.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job posting is no longer accepting applications",
      });
    }

    // Check if application deadline has passed
    if (career.applicationDeadline && new Date() > career.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    req.body.career = req.params.careerId;

    const application = await JobApplication.create(req.body);

    // Send confirmation email to applicant
    try {
      await transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: application.email,
        subject: "Job Application Received",
        html: `
                    <h2>Thank you for your application!</h2>
                    <p>Dear ${application.firstName} ${application.lastName},</p>
                    <p>We have received your application for the position of <strong>${career.title}</strong>.</p>
                    <p>Our HR team will review your application and contact you if your profile matches our requirements.</p>
                    <br>
                    <p>Best regards,<br>${process.env.FROM_NAME}</p>
                `,
      });

      // Send notification to admin
      await transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: process.env.SMTP_EMAIL,
        subject: `New Job Application - ${career.title}`,
        html: `
                    <h2>New Job Application Received</h2>
                    <p><strong>Position:</strong> ${career.title}</p>
                    <p><strong>Applicant:</strong> ${application.firstName} ${application.lastName}</p>
                    <p><strong>Email:</strong> ${application.email}</p>
                    <p><strong>Phone:</strong> ${application.phone}</p>
                    <p><strong>Applied on:</strong> ${new Date().toLocaleDateString()}</p>
                    <p>Login to the admin panel to view full application details.</p>
                `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    sendSuccess(res, application, "Application submitted successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job applications with pagination and filters
// @route   GET /api/v1/applications
// @access  Private (Admin)
exports.getApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, careerId, search } = req.query;

    const query = {};

    if (status) query.status = status;
    if (careerId) query.career = careerId;

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "career", select: "title department employmentType" },
        { path: "reviewedBy", select: "name email" },
      ],
    };

    const applications = await JobApplication.paginate(query, options);

    sendSuccess(res, applications, "Applications fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/v1/applications/:id
// @access  Private (Admin)
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate("career", "title department employmentType location")
      .populate("reviewedBy", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    sendSuccess(res, application, "Application fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/v1/applications/:id/status
// @access  Private (Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const updateData = {
      status,
      reviewedBy: req.admin.id,
      reviewedAt: Date.now(),
    };

    if (notes) updateData.notes = notes;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    ).populate("career", "title");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Send status update email to applicant
    const statusMessages = {
      reviewing: "Your application is currently under review.",
      shortlisted:
        "Congratulations! You have been shortlisted for the next round.",
      interviewed: "Thank you for attending the interview.",
      rejected:
        "Unfortunately, we will not be moving forward with your application at this time.",
      accepted: "Congratulations! We are pleased to offer you the position.",
    };

    try {
      await transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: application.email,
        subject: `Application Status Update - ${application.career.title}`,
        html: `
                    <h2>Application Status Update</h2>
                    <p>Dear ${application.firstName} ${application.lastName},</p>
                    <p>${statusMessages[status] || "Your application status has been updated."}</p>
                    ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ""}
                    <br>
                    <p>Best regards,<br>${process.env.FROM_NAME}</p>
                `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    sendSuccess(res, application, "Application status updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/v1/applications/:id
// @access  Private (Admin)
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    sendSuccess(res, null, "Application deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get application statistics
// @route   GET /api/v1/applications/stats/overview
// @access  Private (Admin)
exports.getApplicationStats = async (req, res, next) => {
  try {
    const totalApplications = await JobApplication.countDocuments();
    const pendingApplications = await JobApplication.countDocuments({
      status: "pending",
    });
    const shortlistedApplications = await JobApplication.countDocuments({
      status: "shortlisted",
    });
    const acceptedApplications = await JobApplication.countDocuments({
      status: "accepted",
    });

    const applicationsByStatus = await JobApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const recentApplications = await JobApplication.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("career", "title")
      .select("firstName lastName email career status createdAt");

    sendSuccess(
      res,
      {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        acceptedApplications,
        applicationsByStatus,
        recentApplications,
      },
      "Application statistics fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};
