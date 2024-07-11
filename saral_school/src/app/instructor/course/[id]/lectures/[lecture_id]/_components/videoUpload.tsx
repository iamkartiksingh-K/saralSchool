"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	ImageIcon,
	Pencil,
	PlusCircle,
	VideoIcon,
	LoaderCircleIcon,
} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import { lectureType, videoType } from "@/lib/types";
import Image from "next/image";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { useRouter } from "next/navigation";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const formSchema = z.object({
	video: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type || ""),
			`Invalid video format. Only ${ACCEPTED_VIDEO_TYPES.join(
				", "
			)} are allowed.`
		)
		.optional(),
});

interface VideoProps {
	initialValues: videoType | null | undefined;
	course_id: string;
	lecture_id: string;
	setLecture: Dispatch<SetStateAction<lectureType>>;
	lecture: lectureType;
}

export const VideoForm = ({
	initialValues,
	lecture_id,
	course_id,
	setLecture,
	lecture,
}: VideoProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const { isSubmitting, isValid } = form.formState;
	const fileRef = form.register("video");

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const formData = new FormData();
		if (values.video) {
			formData.append("video", values?.video?.[0] || "");
			formData.append("video_id", initialValues?.video_id || "");
		}

		try {
			const response = await axios.put(
				`/api/courses/${course_id}/lectures/${lecture_id}`,
				formData
			);
			console.log(response);
			setLecture({ ...lecture, video: response.data.data });
			toggleEdit();
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Lecture Video
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing && <>Cancel</>}
					{!isEditing && !initialValues?.video_id && (
						<>
							<PlusCircle className='h-4 w-4 mr-2' />
						</>
					)}
					{!isEditing && initialValues?.video_id && (
						<>
							<Pencil className='h-4 w-4 mr-2' />
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialValues?.video_id ? (
					<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
						<VideoIcon className='h-10 w-10 text-slate-500' />
					</div>
				) : (
					<div className='relative aspect-video mt-2'>
						<CldVideoPlayer
							width='1920'
							height='1080'
							src={initialValues.url}
						/>
					</div>
				))}{" "}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 mt-4'>
						<FormField
							control={form.control}
							name='video'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='file'
											{...fileRef}
											onChange={(event) => {
												field.onChange(
													event.target?.files?.[0] ??
														undefined
												);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-x-2'>
							<Button
								disabled={!isValid || isSubmitting}
								type='submit'>
								{isSubmitting ? (
									<LoaderCircleIcon className='animate-spin' />
								) : (
									"Save"
								)}
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
