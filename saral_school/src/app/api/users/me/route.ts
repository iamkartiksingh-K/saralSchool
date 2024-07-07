import { NextRequest, NextResponse } from "next/server";
import { getImageObj } from "@/lib/utils";
import axios from "axios";
export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("token")?.value || "";
		if (!token)
			return NextResponse.json(
				{
					message: "token expired",
				},
				{ status: 400 }
			);
		const response = await axios.get(
			`${process.env.STRAPI_URL}/api/users/me?populate=*`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		console.log(response);
		const data = {
			user_id: response?.data.id,
			email: response?.data.email,
			username: response?.data.username,
			bio: response?.data.bio,
			headline: response?.data.headline,
			avatar: getImageObj(response?.data.avatar, "thumbnail"),
			fullName: response?.data.fullName,
		};
		return NextResponse.json({
			message: "User info fetched successfully",
			data: data,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				message: "Some error occurred",
			},
			{ status: 500 }
		);
	}
}
