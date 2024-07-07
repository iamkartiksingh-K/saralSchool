import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { getImageObj } from "@/lib/utils";

export async function GET(
	request: NextRequest,
	{ params }: { params: { instructor_id: string } }
) {
	const { instructor_id } = params;
	const token = cookies().get("token")?.value;
	if (!token)
		return NextResponse.json(
			{
				message: "user not logged in",
			},
			{ status: 400 }
		);

	try {
		const response = await axios.get(
			`${process.env.STRAPI_URL}/api/courses?filters[instructor][id][$eq]=${instructor_id}&populate[0]=thumbnail&publicationState=preview`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const responseData = response.data;
		const data = responseData.data?.map((ob: any) => {
			return {
				course_id: ob.id,
				name: ob.attributes.name,
				category: ob.attributes.category,
				rating: ob.attributes.rating,
				isLive: ob.attributes.isLive,
				publishedAt: ob.attributes.publishedAt,
				thumbnail: getImageObj(ob.attributes.thumbnail.data, "medium"),
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
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{
				message: "Something went wrong",
			},
			{ status: 400 }
		);
	}
}
