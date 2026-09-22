import nodemailer from "nodemailer";
import { get2FATemplate } from "./emailTemplates.js";

export const send2FAEmail = async (to: string, code: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Feitsma Verhuizingen Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}. It expires in 1 minute.`,
    html: get2FATemplate(code),
  });
};
