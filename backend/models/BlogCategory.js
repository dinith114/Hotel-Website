const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide category name"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Auto-generate slug from name
blogCategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Virtual for posts count
blogCategorySchema.virtual("postsCount", {
  ref: "Blog",
  localField: "_id",
  foreignField: "category",
  count: true,
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
