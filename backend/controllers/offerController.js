const Offer = require("../models/Offer");
const { sendSuccess } = require("../utils/responseHandler");

// @desc    Get all offers with pagination and filters
// @route   GET /api/v1/offers
// @access  Public
exports.getOffers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      offerType,
      isFeatured,
      onlyActive,
    } = req.query;

    const query = {};
    const now = new Date();

    // Public users only see active offers within valid date range
    if (!req.admin || onlyActive === "true") {
      query.status = "active";
      query.validFrom = { $lte: now };
      query.validTo = { $gte: now };
    } else {
      if (status) query.status = status;
    }

    if (offerType) query.offerType = offerType;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { priority: -1, createdAt: -1 },
      populate: [
        { path: "applicableRooms", select: "roomType pricePerNight" },
        { path: "createdBy", select: "name" },
      ],
    };

    const offers = await Offer.paginate(query, options);

    sendSuccess(res, offers, "Offers fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get single offer by slug, code, or ID
// @route   GET /api/v1/offers/:identifier
// @access  Public
exports.getOfferByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const now = new Date();

    // Try to find by slug, code, or ID
    let offer = await Offer.findOne({ slug: identifier })
      .populate("applicableRooms", "roomType pricePerNight")
      .populate("createdBy", "name");

    if (!offer) {
      offer = await Offer.findOne({ code: identifier.toUpperCase() })
        .populate("applicableRooms", "roomType pricePerNight")
        .populate("createdBy", "name");
    }

    if (!offer) {
      offer = await Offer.findById(identifier)
        .populate("applicableRooms", "roomType pricePerNight")
        .populate("createdBy", "name");
    }

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Non-admin users can only view active offers within valid date range
    if (!req.admin) {
      if (
        offer.status !== "active" ||
        offer.validFrom > now ||
        offer.validTo < now
      ) {
        return res.status(404).json({
          success: false,
          message: "Offer not found or no longer available",
        });
      }
    }

    sendSuccess(res, offer, "Offer fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Validate offer code
// @route   POST /api/v1/offers/validate
// @access  Public
exports.validateOfferCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Offer code is required",
      });
    }

    const now = new Date();
    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      status: "active",
      validFrom: { $lte: now },
      validTo: { $gte: now },
    }).populate("applicableRooms", "roomType pricePerNight");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired offer code",
      });
    }

    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This offer code has reached its usage limit",
      });
    }

    sendSuccess(
      res,
      {
        offer: {
          id: offer._id,
          title: offer.title,
          description: offer.description,
          offerType: offer.offerType,
          discountPercentage: offer.discountPercentage,
          discountAmount: offer.discountAmount,
          applicableRooms: offer.applicableRooms,
          minBookingDays: offer.minBookingDays,
          maxBookingDays: offer.maxBookingDays,
          validTo: offer.validTo,
        },
      },
      "Offer code is valid",
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Create new offer
// @route   POST /api/v1/offers
// @access  Private (Admin)
exports.createOffer = async (req, res, next) => {
  try {
    req.body.createdBy = req.admin.id;

    const offer = await Offer.create(req.body);

    sendSuccess(res, offer, "Offer created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/v1/offers/:id
// @access  Private (Admin)
exports.updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("applicableRooms", "roomType");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    sendSuccess(res, offer, "Offer updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/v1/offers/:id
// @access  Private (Admin)
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    sendSuccess(res, null, "Offer deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Increment offer usage count
// @route   PUT /api/v1/offers/:id/use
// @access  Private (Admin)
exports.incrementOfferUsage = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },
      { new: true },
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    sendSuccess(res, offer, "Offer usage count updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get offer statistics
// @route   GET /api/v1/offers/stats/overview
// @access  Private (Admin)
exports.getOfferStats = async (req, res, next) => {
  try {
    const now = new Date();

    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({
      status: "active",
      validFrom: { $lte: now },
      validTo: { $gte: now },
    });
    const expiredOffers = await Offer.countDocuments({ status: "expired" });

    const offersByType = await Offer.aggregate([
      {
        $group: {
          _id: "$offerType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalUsage = await Offer.aggregate([
      { $group: { _id: null, total: { $sum: "$usageCount" } } },
    ]);

    const topOffers = await Offer.find({ status: "active" })
      .sort({ usageCount: -1 })
      .limit(5)
      .select("title code usageCount usageLimit validTo");

    sendSuccess(
      res,
      {
        totalOffers,
        activeOffers,
        expiredOffers,
        offersByType,
        totalUsage: totalUsage[0]?.total || 0,
        topOffers,
      },
      "Offer statistics fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};
