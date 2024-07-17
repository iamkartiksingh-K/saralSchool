import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { lecture_id: string } },
) {
  try {
    const { lecture_id } = params;
    const token = cookies().get("token")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/lectures/${lecture_id}?populate=*`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(response.data?.data.attributes.video);
    const data = response.data?.data;
    return NextResponse.json({
      message: "success",
      data: {
        lecture_id: data.id,
        name: data.attributes.name,
        publishedAt: data.attributes.publishedAt,
        isFree: data.attributes.isFree,
        contentLink: data.attributes.contentLink,
        course_id: data.attributes.course.data.id,
        classLink: data.attributes.classLink,
        video: {
          video_id: data.attributes.video?.data?.id,
          url: data.attributes.video?.data?.attributes.url,
        },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { lecture_id: string } },
) {
  try {
    console.log(request);
    const { lecture_id } = params;
    const token = cookies().get("token")?.value;
    if (!token)
      return NextResponse.json(
        {
          message: "user not logged in",
        },
        { status: 400 },
      );
    if (request.headers.get("content-type") === "application/json") {
      const updateData = await request.json();
      const response = await axios.put(
        `${process.env.STRAPI_URL}/api/lectures/${lecture_id}?populate=*`,
        {
          data: {
            ...updateData,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(response.data.data);
      const data = response.data.data;
      return NextResponse.json({
        message: "success",
        data: {
          lecture_id: data.id,
          name: data.attributes.name,
          publishedAt: data.attributes.publishedAt,
          isFree: data.attributes.isFree,
          contentLink: data.attributes.contentLink,
          course_id: data.attributes.course.data.id,
          video: {
            video_id: data.attributes.video?.data?.id,
            url: data.attributes.video?.data?.attributes.url,
          },
        },
      });
    }

    const formData = await request.formData();

    console.log(formData);
    const video = formData.get("video") as File;
    const old_video_id = formData.get("video_id") as string;

    const updateForm = new FormData();
    updateForm.append("ref", "api::lecture.lecture");
    updateForm.append("refId", lecture_id);
    updateForm.append("field", "video");
    updateForm.append("files", video);

    // if (old_video_id) {
    // 	await axios.delete(
    // 		`${process.env.STRAPI_URL}/api/upload/files/${old_video_id}`,
    // 		{
    // 			headers: { Authorization: `Bearer ${token}` },
    // 		}
    // 	);
    // }
    const uploadResponse = await axios.post(
      `${process.env.STRAPI_URL}/api/upload/`,
      updateForm,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log(uploadResponse.data);
    return NextResponse.json({
      message: "success",
      data: {
        video_id: uploadResponse.data[0].id,
        url: uploadResponse.data[0].url,
      },
    });
  } catch (error: any) {
    // console.log("[lecture update]", error);
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
