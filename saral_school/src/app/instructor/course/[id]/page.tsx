"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { courseType, defaultCourse } from "@/lib/types";
import { IconBadge } from "@/components/icon-badge";
import {
	ArrowLeft,
	CircleDollarSign,
	LayoutDashboard,
	ListChecks,
} from "lucide-react";
import { TitleForm } from "./_components/titleForm";
import { DescriptionForm } from "./_components/descriptionForm";
import { ImageForm } from "./_components/fileUpload";
import { CategoryForm } from "./_components/categoryForm";
import { PriceForm } from "./_components/priceForm";
import { LectureForm } from "./_components/lectureForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function EditCourse() {
	const { id } = useParams();
	const [course, setCourse] = useState<courseType>(defaultCourse);
	const [loading, setLoading] = useState<boolean>(true);
	const { toast } = useToast();
	const router = useRouter();
	const requiredFields = [
		course.name,
		course.description,
		course.thumbnail?.url,
		course?.lectures?.find((lecture) => lecture.publishedAt),
		course.category,
	];
	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;

	const completionText = `(${completedFields}/${totalFields})`;

	useEffect(() => {
		async function init() {
			try {
				const response = await axios.get(`/api/courses/${id}`);
				const data = response?.data?.data;
				if (data) setCourse(data);
				console.log(response);
			} catch (error) {
				console.log(error);
				router.push("/");
			} finally {
				setLoading(false);
			}
		}
		init();
	}, [id]);
	const togglePublish = async () => {
		try {
			setLoading(true);
			console.log(course.publishedAt);
			const response = await axios.put(`/api/courses/${id}`, {
				publishedAt: course.publishedAt ? null : new Date(),
			});
			toast({
				title: course.publishedAt
					? "Course unpublished!"
					: "Course published 🎉",
			});
			// console.log(response.data.data.data);
			setCourse(response.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className='container py-3'>
			<div className='flex items-center justify-between my-4'>
				<div className='w-full'>
					<Link
						href={`/instructor`}
						className='flex items-center text-sm hover:opacity-75'>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back to all courses
					</Link>
				</div>
			</div>
			<div className='flex  items-center justify-between mt-8'>
				<div className='flex flex-col gap-y-2'>
					<h2 className='text-2xl font-semibold'>Course Setup</h2>
					<span className='text-slate-700'>
						Complete all fields {completionText}
					</span>
				</div>
				<Button
					disabled={totalFields !== completedFields}
					onClick={togglePublish}>
					{course.publishedAt ? "Un Publish" : "Publish"}
				</Button>
			</div>
			<Separator className='my-3' />
			{!loading && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
					<div>
						<div className='flex items-center gap-x-2'>
							<IconBadge icon={LayoutDashboard} />
							<h2 className='text-xl'>Customize your course</h2>
						</div>
						<TitleForm
							initialValues={{ title: course.name }}
							courseId={course.course_id}
							setCourse={setCourse}
						/>
						<DescriptionForm
							initialValues={{
								description: course.description || "",
							}}
							courseId={course.course_id}
							setCourse={setCourse}
						/>
						<ImageForm
							initialValues={course.thumbnail}
							courseId={course.course_id}
							setCourse={setCourse}
							course={course}
						/>
						<CategoryForm
							initialValues={{ category: course.category }}
							courseId={course.course_id}
							setCourse={setCourse}
						/>
					</div>
					<div className='space-y-6'>
						<div>
							<div className='flex items-center gap-x-2'>
								<IconBadge icon={ListChecks} />
								<h2 className='text-xl'>Course chapters</h2>
							</div>
							<LectureForm
								courseId={course.course_id}
								course={course}
								setCourse={setCourse}
							/>
						</div>
						<div>
							<div className='flex items-center gap-x-2'>
								<IconBadge icon={CircleDollarSign} />
								<h2 className='text-xl'>Sell your course</h2>
							</div>
							<PriceForm
								initialValues={{ price: course.price }}
								courseId={course.course_id}
								setCourse={setCourse}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
