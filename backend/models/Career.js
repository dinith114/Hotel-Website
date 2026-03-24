const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide job title"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Please provide department"],
      trim: true,
      enum: [
        "Front Desk",
        "Housekeeping",
        "Food & Beverage",
        "Kitchen",
        "Management",
        "Maintenance",
        "Sales & Marketing",
        "Finance",
        "Human Resources",
        "Security",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Please provide job location"],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, "Please specify employment type"],
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
    },
    requirements: {
      type: String,
      required: [true, "Please provide job requirements"],
    },
    responsibilities: {
      type: String,
    },
    salaryRange: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    experienceRequired: {
      type: String,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for applications count
careerSchema.virtual("applicationsCount", {
  ref: "JobApplication",
  localField: "_id",
  foreignField: "career",
  count: true,
});

// Index for search
careerSchema.index({ title: "text", description: "text", department: "text" });

// Plugin for pagination
careerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Career", careerSchema);
