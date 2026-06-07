import nodemailer from "nodemailer";
import { get2FATemplate } from "./emailTemplates";

export const send2FAEmail = async (to: string, code: string): Promise<void> => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AutoLent Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}. It expires in 1 minute.`,
    html: get2FATemplate(code),
  });
};
