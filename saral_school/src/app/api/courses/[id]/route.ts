import { imageType } from "@/lib/types";
import { getImageObj } from "@/lib/utils";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function createResponse(data: any) {
  const lectures = data?.attributes.lectures.data;
  const instructor = data?.attributes.instructor.data;

  lectures.sort(
    (a: any, b: any) => a.attributes.position - b.attributes.position,
  );
  console.log(data?.attributes.instructor.data);
  return {
    message: "success",
    data: {
      course_id: data?.id,
      name: data?.attributes.name,
      description: data?.attributes.description,
      category: data?.attributes.category,
      rating: data?.attributes.rating,
      price: data?.attributes.price,
      isLive: data?.attributes.isLive,
      publishedAt: data?.attributes.publishedAt,
      lectures: lectures?.map((lecture: any) => {
        return {
          lecture_id: lecture.id,
          contentLink: lecture.attributes.contentLink,
          classLink: lecture.attributes.classLink,
          isFree: lecture.attributes.isFree,
          name: lecture.attributes.name,
          publishedAt: lecture.attributes.publishedAt,
          course_id: data.id,
          position: lecture.attributes.position,
        };
      }),
      thumbnail: getImageObj(data?.attributes.thumbnail.data, "medium"),
      instructor: {
        user_id: instructor?.id,
        username: instructor?.attributes?.username,
        email: instructor?.attributes?.email,
        isInstructor: instructor?.attributes?.isInstructor,
        fullName: instructor?.attributes?.fullName,
        bio: instructor?.attributes?.bio,
        headline: instructor?.attributes?.headline,
        avatar: getImageObj(instructor?.attributes.avatar?.data, "thumbnail"),
      },
    },
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/courses/${id}?populate[lectures]=lectures&populate[thumbnail]=thumbnail&populate[instructor][populate][2]=avatar`,
    );
    // console.log(response.data.data);
    const data = response.data?.data;

    // console.log(data?.attributes.thumbnail.data);
    return NextResponse.json(createResponse(data));
    // return NextResponse.json({
    //   message: "success",
    //   data: [],
    // });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const token = cookies().get("token")?.value;
    const user_id = cookies().get("user_id")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    // console.log("course put", request);
    if (request.headers.get("content-type") === "application/json") {
      const updatedInfo = await request.json();

      const response = await axios.put(
        `${process.env.STRAPI_URL}/api/courses/${id}?populate=*`,
        {
          data: {
            ...updatedInfo,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // console.log(response.data);
      const data = response.data?.data;

      // console.log(data?.attributes.thumbnail.data);
      return NextResponse.json(createResponse(data));
    }

    const formData = await request.formData();

    console.log(formData);
    const thumbnail = formData.get("thumbnail") as File;
    const old_thumbanil_id = formData.get("image_id") as string;

    const updateForm = new FormData();
    updateForm.append("ref", "api::course.course");
    updateForm.append("refId", id);
    updateForm.append("field", "thumbnail");
    updateForm.append("files", thumbnail);

    if (old_thumbanil_id) {
      await axios.delete(
        `${process.env.STRAPI_URL}/api/upload/files/${old_thumbanil_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
    const uploadResponse = await axios.post(
      `${process.env.STRAPI_URL}/api/upload/`,
      updateForm,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return NextResponse.json({
      message: "success",
      data: {
        url: uploadResponse?.data?.[0].url,
        image_id: uploadResponse?.data?.[0].id,
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
