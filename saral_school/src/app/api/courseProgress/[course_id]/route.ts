import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { course_id: string } },
) {
  const user_id = request.cookies.get("user_id")?.value;
  const token = request.cookies.get("token")?.value;
  const { course_id } = params;

  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );
  try {
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/course-progresses?filters[user_id][$eq]=${user_id}&filters[course_id][$eq]=${course_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = response.data.data;
    console.log(data[0].attributes);
    return NextResponse.json({
      message: "success",
      data: {
        id: data[0].id,
        lastLecture: data[0].attributes.lastLecture,
        completedLectures: data[0].attributes.completedLectures.data,
        user_id: data[0].attributes.user_id,
      },
    });
  } catch (error: any) {
    console.log(error.response);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { course_id: string } },
) {
  const userId = request.cookies.get("user_id")?.value;
  const token = request.cookies.get("token")?.value;
  const { id, lastLecture, completedLectures, user_id } = await request.json();
  const { course_id } = params;
  console.log(id, user_id);
  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );
  if (userId !== user_id)
    return NextResponse.json(
      {
        message: "Unautharized",
      },
      { status: 400 },
    );
  try {
    const response = await axios.put(
      `${process.env.STRAPI_URL}/api/course-progresses/${id}`,
      {
        data: {
          lastLecture,
          completedLectures,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = response.data.data;
    console.log(response.data);
    return NextResponse.json({
      message: "success",
      data: {
        id: data.id,
        lastLecture: data.attributes.lastLecture,
        completedLectures: data.attributes.completedLectures.data,
        user_id: data.attributes.user_id,
      },
    });
  } catch (error: any) {
    console.log(error.response);
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
