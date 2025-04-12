import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "super_secret_key"; // Change this to a strong secret

export async function POST(req: Request) {
  const { username, password, action } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
  }

  // Get users from localStorage (client-side)
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if (action === "signup") {
    // Check if user already exists
    if (users.find((user: { username: string }) => user.username === username)) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Save new user (temporary storage)
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  }

  if (action === "login") {
    // Check if the user exists
    const user = users.find((user: { username: string; password: string }) =>
      user.username === username && user.password === password
    );

    if (!user) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    // Set token in the response
    const response = NextResponse.json({ token }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true, secure: true });

    return response;
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
