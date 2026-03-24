const Admin = require("../models/Admin");
const { sendSuccess } = require("../utils/responseHandler");
const crypto = require("crypto");

// @desc    Register new admin (Super admin only)
// @route   POST /api/v1/auth/register
// @access  Private/Super Admin
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    const token = admin.generateAuthToken();

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
      "Admin registered successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(423).json({
        success: false,
        message:
          "Account is temporarily locked due to multiple failed login attempts. Please try again later.",
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      await admin.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts on successful login
    if (admin.loginAttempts > 0 || admin.lockUntil) {
      await admin.resetLoginAttempts();
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    const token = admin.generateAuthToken();

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
        },
        token,
      },
      "Login successful",
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
        },
      },
      "Admin profile fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const admin = await Admin.findByIdAndUpdate(req.admin.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    sendSuccess(
      res,
      {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      "Profile updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const admin = await Admin.findById(req.admin.id).select("+password");

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;
    await admin.save();

    sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admins (Super admin only)
// @route   GET /api/v1/auth/admins
// @access  Private/Super Admin
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password");

    sendSuccess(
      res,
      {
        count: admins.length,
        admins,
      },
      "Admins fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin status (Super admin only)
// @route   PUT /api/v1/auth/admins/:id/status
// @access  Private/Super Admin
exports.updateAdminStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true },
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    sendSuccess(res, { admin }, "Admin status updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin (Super admin only)
// @route   DELETE /api/v1/auth/admins/:id
// @access  Private/Super Admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    // Prevent deleting self
    if (req.params.id === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    sendSuccess(res, null, "Admin deleted successfully");
  } catch (error) {
    next(error);
  }
};
