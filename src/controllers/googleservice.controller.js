const GoogleServiceEnquiry = require("../models/GoogleServiceEnquiry");
const sendEmail = require("../config/SendEmail")

// CREATE ENQUIRY
exports.createGoogleServiceEnquiry = async (req, res) => {
  try {

    const { name, organisation, domain, users, email, contactNo } = req.body;

    if (!name || !organisation || !domain || !users || !email || !contactNo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const enquiry = await GoogleServiceEnquiry.create({
      name,
      organisation,
      domain,
      users,
      email,
      contactNo
    });
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
          subject: "New GWS Enquiry - Ramot Website",
          htmlContent: `
            <h2>New GWS Form Enquiry</h2>
            <table border="1" cellpadding="10" cellspacing="0">
              <tr>
                <td><b>Name</b></td>
                <td>${name}</td>
              </tr>
               <tr>
                <td><b>Organisation</b></td>
                <td>${organisation}</td>
              </tr>
                <tr>
                <td><b>Domain</b></td>
                <td>${domain}</td>
              </tr>
                <tr>
                <td><b>No of Users</b></td>
                <td>${users}</td>
              </tr>
              <tr>
                <td><b>Email</b></td>
                <td>${email}</td>
              </tr>
             
              <tr>
                <td><b>Contact No</b></td>
                <td>${contactNo}</td>
              </tr>
            </table>
          `,
        };
    
        await sendEmail(emailData);

    res.status(201).json({
      success: true,
      message: "Google Service enquiry submitted successfully",
      data: enquiry
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET ALL ENQUIRIES
exports.getGoogleServiceEnquiries = async (req, res) => {
  try {

    const enquiries = await GoogleServiceEnquiry
      .find()
      .sort({ createdAt: -1 });

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
exports.deleteGoogleServiceEnquiry = async (req, res) => {
  try {

    const enquiry = await GoogleServiceEnquiry.findByIdAndDelete(req.params.id);

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