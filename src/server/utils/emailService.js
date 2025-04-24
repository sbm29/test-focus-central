
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const createTransporter = () => {
  // For development, you can use ethereal.email for testing
  // For production, configure your actual email service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendInvitationEmail = async (to, token, role, tempPassword) => {
  const transporter = createTransporter();
  
  // Generate invite URL (frontend should handle this)
  const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"TestPro" <noreply@testpro.com>',
    to,
    subject: 'Invitation to TestPro Application',
    html: `
      <h1>Welcome to TestPro!</h1>
      <p>You have been invited to join TestPro as a ${role.replace('_', ' ')}.</p>
      <p>Your temporary password is: <strong>${tempPassword}</strong></p>
      <p>Please click the link below to accept the invitation:</p>
      <a href="${inviteUrl}">Accept Invitation</a>
      <p>This link will expire in 7 days.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail
};
