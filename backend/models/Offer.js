const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide offer title"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide offer description"],
    },
    offerType: {
      type: String,
      required: [true, "Please specify offer type"],
      enum: [
        "percentage",
        "fixed_amount",
        "special_package",
        "seasonal",
        "early_bird",
        "last_minute",
      ],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    discountAmount: {
      type: Number,
      min: [0, "Discount amount cannot be negative"],
    },
    validFrom: {
      type: Date,
      required: [true, "Please provide offer start date"],
    },
    validTo: {
      type: Date,
      required: [true, "Please provide offer end date"],
    },
    termsAndConditions: {
      type: String,
      required: [true, "Please provide terms and conditions"],
    },
    applicableRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    minBookingDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxBookingDays: {
      type: Number,
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "draft"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate slug from title
offerSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Auto-update status based on dates
offerSchema.pre("save", function (next) {
  const now = new Date();
  if (this.validTo < now && this.status === "active") {
    this.status = "expired";
  }
  next();
});

// Validation: validTo must be after validFrom
offerSchema.pre("save", function (next) {
  if (this.validTo <= this.validFrom) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

// Index for filtering
offerSchema.index({ status: 1, validFrom: 1, validTo: 1 });

// Plugin for pagination
offerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Offer", offerSchema);
