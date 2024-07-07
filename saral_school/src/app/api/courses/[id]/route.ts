import { imageType } from "@/lib/types";
import { getImageObj } from "@/lib/utils";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function createResponse(data: any) {
	const lectures = data?.attributes.lectures.data;
	lectures.sort(
		(a: any, b: any) => a.attributes.position - b.attributes.position
	);
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
					isFree: lecture.attributes.isFree,
					name: lecture.attributes.name,
					publishedAt: lecture.attributes.publishedAt,
					course_id: data.id,
					position: lecture.attributes.position,
				};
			}),
			thumbnail: getImageObj(data?.attributes.thumbnail.data, "medium"),
		},
	};
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const token = cookies().get("token")?.value;
		if (!token)
			return NextResponse.json(
				{
					message: "user not logged in",
				},
				{ status: 400 }
			);
		const response = await axios.get(
			`${process.env.STRAPI_URL}/api/courses/${id}?populate[0]=lectures&populate[1]=thumbnail&populate[2]=instructor`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		console.log(response.data?.data);
		const data = response.data?.data;

		// console.log(data?.attributes.thumbnail.data);
		return NextResponse.json(createResponse(data));
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
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const token = cookies().get("token")?.value;
		if (!token)
			return NextResponse.json(
				{
					message: "user not logged in",
				},
				{ status: 400 }
			);
		console.log("course put", request);
		if (request.headers.get("content-type") === "application/json") {
			const updatedInfo = await request.json();
			console.log(updatedInfo);
			const response = await axios.put(
				`${process.env.STRAPI_URL}/api/courses/${id}?populate=*`,
				{
					data: {
						...updatedInfo,
					},
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(response.data?.data);
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
				}
			);
		}
		const uploadResponse = await axios.post(
			`${process.env.STRAPI_URL}/api/upload/`,
			updateForm,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
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
