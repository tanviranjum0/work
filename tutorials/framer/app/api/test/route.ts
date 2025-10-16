// app/api/users/route.js

import { NextRequest } from "next/server";

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

export async function POST(request: NextRequest) {
  // Handle POST requests to /api/users
  // const data = await request.json();
  console.log(request.arrayBuffer());
  // Process the data, e.g., save to a database
  return new Response(JSON.stringify({ message: "User created" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
