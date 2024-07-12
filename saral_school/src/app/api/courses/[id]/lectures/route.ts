import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
// /api/lectures
export async function POST(request: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    }
    const data = await request.json();
    const response = await axios.post(
      `${process.env.STRAPI_URL}/api/lectures`,
      {
        data: {
          name: data.lecture,
          publishedAt: null,
          course: {
            connect: [data.courseId],
          },
          position: data.position,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.data.data);
    const lectureData = response?.data.data;
    return NextResponse.json({
      message: "success",
      data: {
        lecture_id: lectureData?.id,
        name: lectureData?.attributes.name,
        isFree: lectureData?.attributes.isFree,
        publishedAt: lectureData?.attributes.publishedAt,
        course_id: data.courseId,
        position: data.position,
      },
    });
  } catch (error: any) {
    console.log("[LECTURE_ROUTE]", error);
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
