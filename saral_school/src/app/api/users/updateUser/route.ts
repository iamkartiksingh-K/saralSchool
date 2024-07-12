import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const bio = formData.get("bio") as string;
  const headline = formData.get("headline") as string;
  const user_id = formData.get("user_id") as string;
  const fullName = formData.get("fullName") as string;
  const avatar = formData.has("avatar") ? (formData.get("avatar") as File) : "";
  const image_id = formData.has("image_id")
    ? (formData.get("image_id") as string)
    : "";
  console.log(avatar);
  // console.log({ avatar });
  try {
    const token = cookies().get("token")?.value;
    console.log(token);
    if (!token)
      return NextResponse.json(
        {
          message: "Token expired",
        },
        {
          status: 400,
        },
      );
    const response = await axios.put(
      `${process.env.STRAPI_URL}/api/users/${user_id}`,
      {
        headline,
        bio,
        fullName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data: any = {
      user_id: response?.data.id,
      email: response?.data.email,
      username: response?.data.username,
      bio: response?.data.bio,
      headline: response?.data.headline,
      fullName: response?.data.fullName,
      isInstructor: response?.data.isInstructor,
    };
    const formData = new FormData();
    let uploadResponse;
    if (avatar) {
      formData.append("ref", "plugin::users-permissions.user");
      formData.append("refId", user_id);
      formData.append("field", "avatar");
      formData.append("files", avatar);
      if (image_id) {
        const response = await axios.delete(
          `${process.env.STRAPI_URL}/api/upload/files/${image_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(response);
      }
      uploadResponse = await axios.post(
        `${process.env.STRAPI_URL}/api/upload/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      data.avatar = {
        url: uploadResponse?.data?.[0].url,
        image_id: uploadResponse?.data?.[0].id,
      };
      console.log(uploadResponse);
    }

    // console.log(response);

    return NextResponse.json({
      message: "Information updated",
      data: data,
    });
  } catch (error: any) {
    console.log("Error updating user", error.code);
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
        message: error.response?.data?.error.message,
      },
      { status: 400 },
    );
  }
}
