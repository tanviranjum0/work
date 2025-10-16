// app/api/users/route.js
import { ReadableStream } from "stream/web";
import { NextRequest, NextResponse } from "next/server";

// "use server";
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

export async function POST(request: NextRequest, response: NextResponse) {
  const { name } = await request.body;
  console.log("Received form data:", name);
  return new Response("User created", { status: 201 });
}
