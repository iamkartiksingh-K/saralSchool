"use client";
import { IconBadge } from "@/components/icon-badge";
import { defaultLecture } from "@/lib/types";
import axios from "axios";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LectureTitleForm } from "./_components/titleForm";
import { Separator } from "@/components/ui/separator";
import { VideoForm } from "./_components/videoUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IsLectureFreeForm } from "./_components/isFreeForm";

export default function LecturePage({
	params,
}: {
	params: { id: string; lecture_id: string };
}) {
	const { id, lecture_id } = params;
	const [lecture, setLecture] = useState(defaultLecture);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();
	useEffect(() => {
		async function init() {
			try {
				const response = await axios.get(
					`/api/courses/${id}/lectures/${lecture_id}`
				);
				console.log(response);
				setLecture(response.data.data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
		init();
	}, [id, lecture_id]);
	const requiredFields = [
		lecture.name,
		lecture.video?.url || lecture.contentLink,
	];
	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const togglePublish = async () => {
		try {
			setIsLoading(true);
			const response = await axios.put(
				`/api/courses/${id}/lectures/${lecture_id}`,
				{
					publishedAt: lecture.publishedAt ? null : new Date(),
				}
			);
			toast({
				title: lecture.publishedAt
					? "Lecture unpublished!"
					: "Lecture published 🎉",
			});
			setLecture(response.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='container p-6'>
			<div className='flex items-center justify-between'>
				<div className='w-full'>
					<Link
						href={`/instructor/course/${id}`}
						className='flex items-center text-sm hover:opacity-75'>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back to course setup
					</Link>
					<div className='flex items-center justify-between w-full mt-8'>
						<div className='flex flex-col gap-y-2'>
							<h1 className='text-2xl font-medium'>
								Chapter Creation
							</h1>
							<span className='text-sm text-slate-700'>
								Complete all fields {completionText}
							</span>
						</div>
						<Button
							disabled={totalFields !== completedFields}
							onClick={togglePublish}>
							{lecture.publishedAt ? "Un Publish" : "Publish"}
						</Button>
					</div>
				</div>
			</div>
			<Separator className='my-3' />

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
				<div className='space-y-4'>
					<div>
						<div className='flex items-center gap-x-2'>
							<IconBadge icon={LayoutDashboard} />
							<h2 className='text-xl'>Customize your chapter</h2>
						</div>
					</div>
					{!isLoading && (
						<>
							<LectureTitleForm
								initialValues={{ title: lecture.name }}
								course_id={id}
								lecture_id={lecture_id}
								setLecture={setLecture}
							/>
							<VideoForm
								initialValues={lecture.video}
								lecture_id={lecture.lecture_id}
								course_id={id}
								setLecture={setLecture}
								lecture={lecture}
							/>
							<IsLectureFreeForm
								initialValues={{ isFree: lecture.isFree }}
								course_id={id}
								lecture_id={lecture_id}
								setLecture={setLecture}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
