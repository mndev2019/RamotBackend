const express = require("express");
const router = express.Router();

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

// CREATE
router.post("/contact-enquiry", createContactEnquiry);

// GET ALL
router.get("/contact-enquiries", getAllEnquiries);

// DELETE
router.delete("/contact-enquiry/:id", deleteEnquiry);




router.post("/google-service-enquiry", createGoogleServiceEnquiry);

router.get("/google-service-enquiry", getGoogleServiceEnquiries);

router.delete("/google-service-enquiry/:id", deleteGoogleServiceEnquiry);

module.exports = router;