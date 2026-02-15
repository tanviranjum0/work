import { Resend } from "resend";

export const resendClient = new Resend(process.env.RESEND_API);

export const sender = {
  email: process.env.RESEND_EMAIL_FROM,
  name: process.env.RESEND_EMAIL_NAME,
};

export const sendMail = async (to, subject, html) => {
  try {
    const info = await resendClient.emails.send({
      from: sender.email,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
