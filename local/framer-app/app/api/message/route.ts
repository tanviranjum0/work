import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import Db from "@/utils/db";
// import { format } from "path";

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
    const FormData = await request.formData(); // Assuming JSON body
    // console.log("Received POST request with body:", body.get("image"));
    // const image =  body.get("image");
    // const body = await request.json();
    console.log(FormData.get("name"));
    const body = {
      service: FormData.get("service"),
      budget: FormData.get("budget"),
      name: FormData.get("name"),
      email: FormData.get("email"),
      message: FormData.get("message"),
      // image: FormData.get("image"),
      isValidImage: FormData.get("isValidImage") === "true" ? true : false,
    };
    console.log("Received POST request with body:", body);
    await Db.connect();
    // const existUser = await Message.findOne({ email: body.email });

    // if (existUser)
    //   return NextResponse.json("This email is already existed.", {
    //     status: 409,
    //   });
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
