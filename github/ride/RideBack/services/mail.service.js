"use strict";

const { Resend } = require("resend");

async function sendMail(to, subject, html) {
  if (!process.env.RESEND_API || !process.env.RESEND_EMAIL_FROM) {
    throw new Error("Email delivery is not configured.");
  }
  const resendClient = new Resend(process.env.RESEND_API);
  const result = await resendClient.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to,
    subject,
    html,
  });
  if (result.error) throw new Error("Email delivery failed.");
  return result.data;
}

module.exports = { sendMail };
