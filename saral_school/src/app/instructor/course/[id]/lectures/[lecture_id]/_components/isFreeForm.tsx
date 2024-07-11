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
import { Pencil, LoaderCircleIcon } from "lucide-react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { courseType, lectureType } from "@/lib/types";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
	isFree: z.boolean(),
});

interface IsLectureFreeFormProps {
	initialValues: {
		isFree: boolean;
	};
	course_id: string;
	lecture_id: string;
	setLecture: Dispatch<SetStateAction<lectureType>>;
}

export const IsLectureFreeForm = ({
	initialValues,
	lecture_id,
	course_id,
	setLecture,
}: IsLectureFreeFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	});

	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const response = await axios.put(
			`/api/courses/${course_id}/lectures/${lecture_id}`,
			{
				isFree: values.isFree,
			}
		);
		const data = response?.data?.data;
		if (data) {
			toggleEdit();
			setLecture(data);
		}
		console.log(response);
	};
	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Is this lecture Free ?
				<Button variant={"ghost"} onClick={toggleEdit}>
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className='h-4 w-4 mr-2' />
						</>
					)}
				</Button>
			</div>
			{!isEditing && <p>{initialValues.isFree ? "Yes" : "No"}</p>}{" "}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 mt-4'>
						<FormField
							control={form.control}
							name='isFree'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
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
