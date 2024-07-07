import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
	const data = await request.json();
	const username = uuidv4();
	try {
		const response = await axios.post(
			`${process.env.STRAPI_URL}/api/auth/local/register`,
			{
				...data,
				username,
			}
		);
		console.log(response);
		return NextResponse.json({
			message: "Confirmation email sent",
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
				message: error.response?.data?.error.message,
			},
			{ status: 400 }
		);
	}
}
