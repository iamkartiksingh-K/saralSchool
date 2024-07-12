import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    const { lectures } = await request.json();
    console.log(lectures);
    for (let lecture of lectures) {
      await axios.put(
        `${process.env.STRAPI_URL}/api/lectures/${lecture.lecture_id}`,
        {
          data: {
            position: lecture.position,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
    return NextResponse.json({
      message: "success",
    });
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          message: "Unable to connect to strapi",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 400 },
    );
  }
}
