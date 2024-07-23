import { getImageObj } from "@/lib/utils";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { course_id: string } },
) {
  const { course_id } = params;
  const token = cookies().get("token")?.value;
  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );

  try {
    const userResponse = await axios.get(
      `${process.env.STRAPI_URL}/api/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const user_id = userResponse.data.id;
    const courseResponse = await axios.get(
      `${process.env.STRAPI_URL}/api/courses/${course_id}?populate[students]=students&populate[lectures][populate][0]=video`,
    );
    // instead of checking the student, you should check if there is an entry in purchases collection with current user_id and course_id
    // I created the purchase collection after this route so I forgot updating this route.

    const students = courseResponse.data.data.attributes.students.data;
    let found = false;
    for (let student of students) {
      if (student.id === user_id) {
        found = true;
        break;
      }
    }
    if (!found) {
      return NextResponse.json(
        {
          message: "Not a student",
        },
        { status: 403 },
      );
    }
    const lectures = courseResponse.data.data.attributes.lectures.data;
    const publishedLectures = lectures.filter((lecture: any) => {
      return lecture.attributes.publishedAt;
    });
    publishedLectures.sort(
      (a: any, b: any) => a.attributes.position - b.attributes.position,
    );
    console.log(publishedLectures);
    return NextResponse.json({
      message: "success",
      data: publishedLectures.map((lecture: any) => {
        return {
          lecture_id: lecture.id,
          name: lecture.attributes.name,
          position: lecture.attributes.position,
          publishedAt: lecture.attributes.publishedAt,
          isFree: lecture.attributes.isFree,
          classLink: lecture.attributes.classLink,
          contentLink: lecture.attributes.contentLink,
          video: {
            video_id: lecture.attributes.video?.data?.id,
            url: lecture.attributes.video?.data?.attributes.url,
          },
        };
      }),
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
