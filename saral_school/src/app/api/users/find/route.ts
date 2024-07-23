import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { instructor_id: string } },
) {
  try {
    const { instructor_id } = params;
    const response = await axios.get(
      `${process.env.STRAPI_URL}/api/users/${instructor_id}?populate[0]=thumbnail`,
    );
    console.log(response);
    return NextResponse.json({
      message: "success",
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
