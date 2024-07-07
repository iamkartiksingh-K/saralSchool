import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const token = cookies().get("token")?.value;
		if (!token)
			return NextResponse.json(
				{
					message: "user not logged in",
				},
				{ status: 400 }
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
			}
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
