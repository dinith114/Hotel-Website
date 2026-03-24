const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide blog title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please provide blog excerpt"],
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: [true, "Please select a category"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    featuredImageUrl: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [70, "Meta title cannot exceed 70 characters"],
      },
      metaDescription: {
        type: String,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Auto-set publishedAt when status changes to published
blogSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for search and filtering
blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});
blogSchema.index({ status: 1, publishedAt: -1 });

// Plugin for pagination
blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Blog", blogSchema);
