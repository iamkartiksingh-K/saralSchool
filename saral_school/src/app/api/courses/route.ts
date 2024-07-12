import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getImageObj } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    const { name, isLive, user_id } = await request.json();
    const response = await axios.post(
      `${process.env.STRAPI_URL}/api/courses`,
      {
        data: {
          name,
          isLive,
          publishedAt: null,
          instructor: {
            connect: [user_id],
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = response?.data?.data;
    const instructor = data?.attributes?.instructor?.data;
    console.log(data);
    return NextResponse.json({
      message: "course created successfully",
      data: {
        course_id: data?.id,
      },
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

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/courses?populate[0]=instructor&populate[1]=thumbnail`,
    );
    const data = response.data.data;
    const allCourses = data.map((course: any) => {
      return {
        course_id: course.id,
        name: course.attributes.name,
        rating: course.attributes.rating,
        price: course.attributes.price,
        isLive: course.attributes.isLive,
        instructor: {
          user_id: course.attributes.instructor.data.id,
          username: course.attributes.instructor.data.attributes.username,
          email: course.attributes.instructor.data.attributes.email,
          isInstructor:
            course.attributes.instructor.data.attributes.isInstructor,
          fullName: course.attributes.instructor.data.attributes.fullName,
        },
        thumbnail: getImageObj(course?.attributes.thumbnail.data, "medium"),
      };
    });
    console.log(allCourses);
    return NextResponse.json({
      message: "success",
      data: allCourses,
    });
  } catch (error: any) {
    console.log(error);
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
