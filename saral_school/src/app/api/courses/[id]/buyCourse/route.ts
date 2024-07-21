import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = request.cookies.get("token")?.value;
  const user_id = request.cookies.get("user_id")?.value;
  const { id } = params;
  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );
  try {
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/purchases?filters[user_id][$eq]=${user_id}&filters[course_id][$eq]=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.data);
    if (response.data.data.length > 0) {
      return NextResponse.json({
        message: "bought",
      });
    }
    return NextResponse.json({
      message: "not bought",
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
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = request.cookies.get("token")?.value;
  const user_id = request.cookies.get("user_id")?.value;
  const { id } = params;
  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );
  try {
    const response = await axios.post(
      `${process.env.STRAPI_URL}/api/purchases`,
      {
        data: {
          user_id,
          course_id: id,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const addUser = await axios.put(
      `${process.env.STRAPI_URL}/api/courses/${id}?populate=*`,
      {
        data: {
          students: {
            connect: [user_id],
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const progressResponse = await axios.post(
      `${process.env.STRAPI_URL}/api/course-progresses`,
      {
        data: {
          lastLecture: "",
          completedLectures: { data: [] },
          user_id: user_id,
          course_id: id,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.data);
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
