const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


const sendMail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"LabTrack" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = sendMail;