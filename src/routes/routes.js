const express = require("express");
const router = express.Router();
const upload = require("../config/multer")
const {
  createContactEnquiry,
  getAllEnquiries,
  deleteEnquiry
} = require("../controllers/contact.controller");
const {
  createGoogleServiceEnquiry,
  getGoogleServiceEnquiries,
  deleteGoogleServiceEnquiry
} = require("../controllers/googleservice.controller");

const {
createBlog,
getAllBlogs,
getBlogBySlug,
updateBlog,
deleteBlog
} = require("../controllers/blog.controller")

const {getSitemap} = require("../controllers/sitemap.controller")


// CREATE
router.post("/contact-enquiry", createContactEnquiry);

// GET ALL
router.get("/contact-enquiries", getAllEnquiries);

// DELETE
router.delete("/contact-enquiry/:id", deleteEnquiry);




router.post("/google-service-enquiry", createGoogleServiceEnquiry);

router.get("/google-service-enquiry", getGoogleServiceEnquiries);

router.delete("/google-service-enquiry/:id", deleteGoogleServiceEnquiry);



// blogs
router.post("/blog", upload.single("image"), createBlog);
router.get("/blog", getAllBlogs);
// router.get("/blog/:id", getSingleBlog);
// ✅ SLUG ROUTE
router.get("/blog/:slug", getBlogBySlug);
router.put("/blog/:id", upload.single("image"), updateBlog);
router.delete("/blog/:id", deleteBlog);


// sitemap route
router.get("/sitemap", getSitemap);

module.exports = router;