import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { getImageObj } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // const { instructor_id } = params;
  const token = cookies().get("token")?.value;
  if (!token)
    return NextResponse.json(
      {
        message: "user not logged in",
      },
      { status: 400 },
    );

  try {
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/users/me?populate[courses][populate][0]=thumbnail`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const responseData = response.data;
    console.log("Here::", response.data);
    const data = responseData.courses?.map((ob: any) => {
      return {
        course_id: ob.id,
        name: ob.name,
        category: ob.category,
        rating: ob.rating,
        isLive: ob.isLive,
        price: ob.price,
        publishedAt: ob.publishedAt,
        thumbnail: getImageObj(ob.thumbnail, "medium"),
      };
    });
    console.log(data);

    // const data = {
    // 	course_id: responseData.id,
    // };
    return NextResponse.json({
      message: "success",
      data,
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
