const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const jobApplicationSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: [true, "Please specify the job position"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email address"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        required: [true, "Please provide country"],
      },
      zipCode: String,
    },
    education: {
      type: String,
      required: [true, "Please provide education details"],
    },
    experience: {
      type: String,
      required: [true, "Please provide work experience"],
    },
    skills: {
      type: String,
    },
    coverLetter: {
      type: String,
      required: [true, "Please provide a cover letter"],
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    availability: {
      type: String,
      enum: [
        "Immediate",
        "Within 2 weeks",
        "Within 1 month",
        "Within 2 months",
        "Negotiable",
      ],
      default: "Negotiable",
    },
    expectedSalary: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "shortlisted",
        "interviewed",
        "rejected",
        "accepted",
      ],
      default: "pending",
    },
    notes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
jobApplicationSchema.index({ career: 1, status: 1 });
jobApplicationSchema.index({ email: 1 });

// Plugin for pagination
jobApplicationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
