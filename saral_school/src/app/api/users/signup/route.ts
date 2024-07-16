import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = uuidv4();
  try {
    const response = await axios.post(
      `${process.env.STRAPI_URL}/api/auth/local/register`,
      {
        ...data,
        username,
      },
    );
    console.log(response);
    return NextResponse.json({
      message: "Confirmation email sent",
    });
  } catch (error: any) {
    console.log("Error registering user", error);
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          message: "Unable to connect to backend",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        message: "Email is already taken!",
      },
      { status: 400 },
    );
  }
}
