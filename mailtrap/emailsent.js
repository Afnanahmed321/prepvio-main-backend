import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE // ✅ Make sure you export this from emailTemplates.js
} from "./emailTemplates.js";

// ✅ Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: 'prepvio.ai@gmail.com',
    pass: 'epwbketlfbtbtamt'
  }
});
 const user = 'prepvio.ai@gmail.com'
 const pass = 'epwbketlfbtbtamt'

// ✅ Verify transporter credentials on server start
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to take messages");
  }
});

// Helper function to send email
const sendEmail = async (to, subject, html) => {
  if (!user || !pass) {
    throw new Error("SMTP credentials are missing in .env");
  }

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

  try {
    const info = await sendEmail(email, "Verify your email", htmlContent);
    console.log("✅ Verification email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

// Send welcome email with HTML template
export const sendWelcomeEmail = async (email, name) => {
  const htmlContent = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);

  try {
    const info = await sendEmail(email, "Welcome to Prepvio 🎉", htmlContent);
    console.log("✅ Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  try {
    const info = await sendEmail(email, "Reset your password", htmlContent);
    console.log("✅ Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await sendEmail(email, "Password Reset Successful", PASSWORD_RESET_SUCCESS_TEMPLATE);
    console.log("✅ Password reset success email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending password reset success email:", error);
  }
};
