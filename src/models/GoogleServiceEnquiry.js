const mongoose = require("mongoose");

const googleServiceEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    organisation: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
    users: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    contactNo: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "GoogleServiceEnquiry",
  googleServiceEnquirySchema
);