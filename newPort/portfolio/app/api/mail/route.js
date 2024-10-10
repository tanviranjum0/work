import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
export async function POST(request) {
  const requestParsed = await request.json();
  // console.log(requestParsed);
  // console.log(requestParsed.email);
  // console.log(requestParsed.body);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "tanviranjum010@gmail.com",
      pass: "cyhxsdgoqaterljk",
    },
  });

  const selftransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "tanviranjum010@gmail.com",
      pass: "cyhxsdgoqaterljk",
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: '"Hey There!!" <Tanviranjum010@gmail,com>',
      to: `${requestParsed.email}`,
      subject: "Reply from Tanvir",
      text: "I will be reach you out as soon as possible",
    });

    console.log("Message sent: %s", info.messageId);
  }

  async function selfmail() {
    const info = await selftransporter.sendMail({
      from: '"Hey There!!" <Tanviranjum010@gmail,com>',
      to: `tanviranjum0@icloud.com`,
      subject: "New visitor message",
      text: `Email Address : ${requestParsed.email} Message:${requestParsed.message}`,
    });

    console.log("Message sent: %s", info.messageId);
  }

  await main().catch(console.error);
  await selfmail().catch(console.error);
  return NextResponse.json({ Message: "Message Sent" }, { status: 200 });
}

// import { redirect } from "next/navigation";
// import { NextResponse } from "next/server";

// export async function POST(request) {

//   const data = await request.json();
//   console.log(data);

//   return NextResponse.json({ Message: "Hello" }, { status: 200 });
// }
