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
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";
import { courseType, imageType } from "@/lib/types";
import Image from "next/image";

const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];
const formSchema = z.object({
	thumbnail: z
		.unknown()
		.transform((value) => {
			return value as FileList;
		})
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type || ""),
			"Only .jpg, .jpeg, .png and .webp formats are supported."
		)
		.optional(),
});

interface ImageProps {
	initialValues: imageType | null | undefined;
	courseId: string;
	setCourse: Dispatch<SetStateAction<courseType>>;
	course: courseType;
}

export const ImageForm = ({
	initialValues,
	courseId,
	setCourse,
	course,
}: ImageProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const { isSubmitting, isValid } = form.formState;
	const fileRef = form.register("thumbnail");

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const formData = new FormData();
		if (values.thumbnail) {
			formData.append("thumbnail", values?.thumbnail?.[0] || "");
			formData.append("image_id", initialValues?.image_id || "");
			const response = await axios.put(
				`/api/courses/${courseId}`,
				formData
			);
			const data = response?.data?.data;
			console.log(data);
			if (data) {
				setIsEditing(false);
				setCourse({ ...course, thumbnail: data });
			}
			console.log(response);
		}
	};
	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course Thumbnail
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing && <>Cancel</>}
					{!isEditing && !initialValues?.image_id && (
						<>
							<PlusCircle className='h-4 w-4 mr-2' />
						</>
					)}
					{!isEditing && initialValues?.image_id && (
						<>
							<Pencil className='h-4 w-4 mr-2' />
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialValues?.image_id ? (
					<div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
						<ImageIcon className='h-10 w-10 text-slate-500' />
					</div>
				) : (
					<div className='relative aspect-video mt-2'>
						<Image
							alt='Upload'
							fill
							className='object-cover rounded-md'
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
							name='thumbnail'
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
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
