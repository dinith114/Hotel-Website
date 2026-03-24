const Career = require("../models/Career");
const { sendSuccess } = require("../utils/responseHandler");

// @desc    Get all careers with pagination and filters
// @route   GET /api/v1/careers
// @access  Public
exports.getCareers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      department,
      employmentType,
      search,
    } = req.query;

    const query = {};

    // Filter by status (public only sees active jobs)
    if (req.admin) {
      if (status) query.status = status;
    } else {
      query.status = "active";
    }

    if (department) query.department = department;
    if (employmentType) query.employmentType = employmentType;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: "postedBy", select: "name email" },
    };

    const careers = await Career.paginate(query, options);

    sendSuccess(res, careers, "Careers fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get single career by ID
// @route   GET /api/v1/careers/:id
// @access  Public
exports.getCareerById = async (req, res, next) => {
  try {
    const career = await Career.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("applicationsCount");

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    // Non-admin users can only view active jobs
    if (!req.admin && career.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    sendSuccess(res, career, "Career fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new career posting
// @route   POST /api/v1/careers
// @access  Private (Admin)
exports.createCareer = async (req, res, next) => {
  try {
    req.body.postedBy = req.admin.id;

    const career = await Career.create(req.body);

    sendSuccess(res, career, "Career created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update career
// @route   PUT /api/v1/careers/:id
// @access  Private (Admin)
exports.updateCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    sendSuccess(res, career, "Career updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete career
// @route   DELETE /api/v1/careers/:id
// @access  Private (Admin)
exports.deleteCareer = async (req, res, next) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    sendSuccess(res, null, "Career deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get career statistics (Admin)
// @route   GET /api/v1/careers/stats/overview
// @access  Private (Admin)
exports.getCareerStats = async (req, res, next) => {
  try {
    const totalJobs = await Career.countDocuments();
    const activeJobs = await Career.countDocuments({ status: "active" });
    const closedJobs = await Career.countDocuments({ status: "closed" });
    const draftJobs = await Career.countDocuments({ status: "draft" });

    const jobsByDepartment = await Career.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    sendSuccess(
      res,
      {
        totalJobs,
        activeJobs,
        closedJobs,
        draftJobs,
        jobsByDepartment,
      },
      "Career statistics fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};
