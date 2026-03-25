


// const Blog = require("../models/Blog");
// const fs = require("fs");
// const path = require("path");

// /* =========================================
//    CREATE BLOG
// ========================================= */
// exports.createBlog = async (req, res) => {
//   try {
//     const { title, description, short_description } = req.body;

//     if (!title || !description || !short_description) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const image = req.file ? req.file.filename : null;

//     const newBlog = await Blog.create({
//       title,
//       description,
//       short_description,
//       image,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Blog created successfully",
//       data: {
//         ...newBlog._doc,
//         image: newBlog.image ? `uploads/${newBlog.image}` : null,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating blog",
//       error: error.message,
//     });
//   }
// };

// /* =========================================
//    GET ALL BLOGS
// ========================================= */
// exports.getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });

//     const updatedBlogs = blogs.map((blog) => ({
//       ...blog._doc,
//       image: blog.image ? `uploads/${blog.image}` : null,
//     }));

//     res.status(200).json({
//       success: true,
//       count: blogs.length,
//       data: updatedBlogs,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching blogs",
//       error: error.message,
//     });
//   }
// };

// /* =========================================
//    GET SINGLE BLOG
// ========================================= */
// exports.getSingleBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         ...blog._doc,
//         image: blog.image ? `uploads/${blog.image}` : null,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching blog",
//       error: error.message,
//     });
//   }
// };

// /* =========================================
//    UPDATE BLOG
// ========================================= */
// exports.updateBlog = async (req, res) => {
//   try {
//     const { title, description, short_description } = req.body;

//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     // Update fields
//     blog.title = title || blog.title;
//     blog.description = description || blog.description;
//     blog.short_description = short_description || blog.short_description;

//     // If new image uploaded → delete old image
//     if (req.file) {

//       if (blog.image) {
//         const oldImagePath = path.join(__dirname, "../../uploads", blog.image);

//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }

//       blog.image = req.file.filename;
//     }

//     await blog.save();

//     res.status(200).json({
//       success: true,
//       message: "Blog updated successfully",
//       data: {
//         ...blog._doc,
//         image: blog.image ? `uploads/${blog.image}` : null,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating blog",
//       error: error.message,
//     });
//   }
// };

// /* =========================================
//    DELETE BLOG
// ========================================= */
// exports.deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);

//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: "Blog not found",
//       });
//     }

//     // Delete image file
//     if (blog.image) {
//       const imagePath = path.join(__dirname, "../../uploads", blog.image);

//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     await blog.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Blog deleted successfully",
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting blog",
//       error: error.message,
//     });
//   }
// };


// controllers/blogController.js

const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

/* =========================================
   CREATE BLOG
========================================= */
exports.createBlog = async (req, res) => {
  try {
    const { title, description, short_description } = req.body;

    if (!title || !description || !short_description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const image = req.file ? req.file.filename : null;

    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;

    let existing = await Blog.findOne({ slug });
    let count = 1;

    while (existing) {
      slug = `${baseSlug}-${count}`;
      existing = await Blog.findOne({ slug });
      count++;
    }

    const newBlog = await Blog.create({
      title,
      description,
      short_description,
      image,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

/* =========================================
   GET ALL BLOGS
========================================= */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const updatedBlogs = blogs.map((blog) => ({
      ...blog._doc,
      image: blog.image ? `uploads/${blog.image}` : null,
    }));

    res.status(200).json({
      success: true,
      data: updatedBlogs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

/* =========================================
   GET BLOG BY SLUG
========================================= */
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...blog._doc,
        image: blog.image ? `uploads/${blog.image}` : null,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

/* =========================================
   UPDATE BLOG
========================================= */
exports.updateBlog = async (req, res) => {
  try {
    const { title, description, short_description } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.short_description = short_description || blog.short_description;

    // ✅ update slug if title changes
    // slug sirf tab banega jab missing ho
    if (!blog.slug) {
      const baseSlug = slugify(blog.title, {
        lower: true,
        strict: true,
      });

      let slug = baseSlug;
      let existing = await Blog.findOne({ slug });

      let count = 1;

      while (existing) {
        slug = `${baseSlug}-${count}`;
        existing = await Blog.findOne({ slug });
        count++;
      }

      blog.slug = slug;
    }

    // image update
    if (req.file) {
      if (blog.image) {
        const oldPath = path.join(__dirname, "../../uploads", blog.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      blog.image = req.file.filename;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

/* =========================================
   DELETE BLOG
========================================= */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.image) {
      const imagePath = path.join(__dirname, "../../uploads", blog.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};