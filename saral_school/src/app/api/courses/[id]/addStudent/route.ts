import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const token = cookies().get("token")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    const data = await request.json();
    console.log();
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/users?filters[email][$eq]=${data.data.email}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const users = response.data;
    if (users.length === 0)
      return NextResponse.json({
        message: "User Not Found",
      });

    console.log(users[0].id);

    const addUser = await axios.put(
      `${process.env.STRAPI_URL}/api/courses/${id}?populate=*`,
      {
        data: {
          students: {
            connect: [users[0].id],
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    await axios.post(
      `${process.env.STRAPI_URL}/api/purchases`,
      {
        data: {
          user_id: users[0].id,
          course_id: id,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    await axios.post(
      `${process.env.STRAPI_URL}/api/course-progresses`,
      {
        data: {
          lastLecture: "",
          completedLectures: { data: [] },
          user_id: String(users[0].id),
          course_id: id,
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return NextResponse.json({
      message: "User added",
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
