const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");
const { sendSuccess } = require("../utils/responseHandler");

// @desc    Get all blog posts with pagination and filters
// @route   GET /api/v1/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      isFeatured,
      search,
      tags,
    } = req.query;

    const query = {};

    // Public users only see published posts
    if (req.admin) {
      if (status) query.status = status;
    } else {
      query.status = "published";
    }

    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (tags) query.tags = { $in: tags.split(",") };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { publishedAt: -1, createdAt: -1 },
      populate: [
        { path: "category", select: "name slug" },
        { path: "author", select: "name" },
      ],
    };

    const blogs = await Blog.paginate(query, options);

    sendSuccess(res, blogs, "Blog posts fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post by slug or ID
// @route   GET /api/v1/blogs/:identifier
// @access  Public
exports.getBlogByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    // Try to find by slug first, then by ID
    let blog = await Blog.findOne({ slug: identifier })
      .populate("category", "name slug")
      .populate("author", "name");

    if (!blog) {
      blog = await Blog.findById(identifier)
        .populate("category", "name slug")
        .populate("author", "name");
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Non-admin users can only view published posts
    if (!req.admin && blog.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment view count for published posts
    if (blog.status === "published") {
      blog.viewsCount += 1;
      await blog.save();
    }

    sendSuccess(res, blog, "Blog post fetched successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/v1/blogs
// @access  Private (Admin)
exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.admin.id;

    const blog = await Blog.create(req.body);

    sendSuccess(res, blog, "Blog post created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private (Admin)
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    sendSuccess(res, blog, "Blog post updated successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Admin)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    sendSuccess(res, null, "Blog post deleted successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog statistics
// @route   GET /api/v1/blogs/stats/overview
// @access  Private (Admin)
exports.getBlogStats = async (req, res, next) => {
  try {
    const totalPosts = await Blog.countDocuments();
    const publishedPosts = await Blog.countDocuments({ status: "published" });
    const draftPosts = await Blog.countDocuments({ status: "draft" });
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$viewsCount" } } },
    ]);

    const postsByCategory = await Blog.aggregate([
      {
        $lookup: {
          from: "blogcategories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const topPosts = await Blog.find({ status: "published" })
      .sort({ viewsCount: -1 })
      .limit(5)
      .select("title slug viewsCount publishedAt")
      .populate("category", "name");

    sendSuccess(
      res,
      {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews[0]?.total || 0,
        postsByCategory,
        topPosts,
      },
      "Blog statistics fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};
