import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import Db from "@/utils/db";
// import { format } from "path";
interface DataBody {
  name: FormDataEntryValue | null;
  image?: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
  service: FormDataEntryValue | null;
  budget: FormDataEntryValue | null;
  isValidImage: FormDataEntryValue | boolean | null;
}

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
    const body: DataBody = {
      service: FormData.get("service"),
      budget: FormData.get("budget"),
      name: FormData.get("name"),
      email: FormData.get("email"),
      message: FormData.get("message"),
      isValidImage: FormData.get("isValidImage") === "true" ? true : false,
    };
    if (FormData.get("image")) {
      body.image = FormData.get("image");
    }
    await Db.connect();
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
