import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import Db from "@/utils/db";

export async function GET(request: Request) {
  // Handle GET requests to /api/users
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  try {
    // const body = await request.formData(); // Assuming JSON body
    // console.log("Received POST request with body:", body.get("image"));
    // const image =  body.get("image");

    // const body = await request.json();
    const body = {
      name: "John Doe",
      email: "john.doe1@example.com",
      message: "Hello, this is a test message.",
      image: "sample-string",
    };
    await Db.connect();
    const existUser = await Message.findOne({ email: body.email });

    if (existUser)
      return NextResponse.json("This email is already existed.", {
        status: 200,
      });
    const message = await Message.create(body);
    await Db.disconnect();
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
