import { NextRequest, NextResponse } from "next/server";
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

    const body = await request.json();
    console.log("Received POST request with body:", body);
    return NextResponse.json(
      { message: "Data received successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
