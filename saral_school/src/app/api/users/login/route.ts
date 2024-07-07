import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
	const { identifier, password } = await request.json();
	console.log(identifier, password);
	try {
		const response = await axios.post(
			`${process.env.STRAPI_URL}/api/auth/local?populate=*`,
			{
				identifier,
				password,
			}
		);
		console.log(response);
		const oneMonth = 30 * 24 * 60 * 60 * 1000;
		cookies().set("token", response.data?.jwt, { maxAge: oneMonth });
		// const data = {
		// 	user_id: response?.data.user?.id,
		// 	email: response?.data.user?.email,
		// 	username: response?.data.user?.username,
		// 	bio: response?.data.user?.bio,
		// 	headline: response?.data.user?.headline,
		// 	fullName: response?.data.user?.fullName,
		// };
		return NextResponse.json({
			message: "Logged in successfully",
		});
	} catch (error: any) {
		console.log("Error registering user", error.code);
		if (error.code === "ECONNREFUSED") {
			return NextResponse.json(
				{
					message: "Unable to connect to backend",
				},
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{
				message: "Invalid credentials",
			},
			{ status: 400 }
		);
	}
}
