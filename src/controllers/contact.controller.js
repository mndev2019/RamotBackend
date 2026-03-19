const Contact = require("../models/Contact");
const sendEmail = require("../config/SendEmail")
// CREATE ENQUIRY
exports.createContactEnquiry = async (req, res) => {
  try {
    const { name, mobile, email, message } = req.body;

    if (!name || !mobile || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newContact = new Contact({
      name,
      mobile,
      email,
      message
    });

    await newContact.save();
      // 📧 Email Data
    const emailData = {
      sender: {
        name: "Ramot Website",
        email: "admin@ramot.in",
      },
      to: [
        {
          email: "admin@ramot.in",
        },
      ],
      subject: "New Contact Enquiry - Ramot Website",
      htmlContent: `
        <h2>New Contact Form Enquiry</h2>
        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <td><b>Name</b></td>
            <td>${name}</td>
          </tr>
          <tr>
            <td><b>Email</b></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><b>Mobile</b></td>
            <td>${mobile}</td>
          </tr>
          <tr>
            <td><b>Message</b></td>
            <td>${message}</td>
          </tr>
        </table>
      `,
    };

    await sendEmail(emailData);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: newContact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL ENQUIRIES
exports.getAllEnquiries = async (req, res) => {
  try {

    const enquiries = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE ENQUIRY
exports.deleteEnquiry = async (req, res) => {
  try {

    const { id } = req.params;

    const enquiry = await Contact.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};