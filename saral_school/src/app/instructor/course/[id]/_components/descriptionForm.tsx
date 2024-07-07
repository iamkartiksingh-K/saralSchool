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
import { Pencil } from "lucide-react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { courseType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	description: z.string().min(1, { message: "Description is required" }),
});

interface DescriptionFormProps {
	initialValues: {
		description: string;
	};
	courseId: string;
	setCourse: Dispatch<SetStateAction<courseType>>;
}

export const DescriptionForm = ({
	initialValues,
	courseId,
	setCourse,
}: DescriptionFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	});

	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const response = await axios.put(`/api/courses/${courseId}`, {
			description: values.description,
		});
		const data = response?.data?.data;
		if (data) {
			setIsEditing(false);
			setCourse(data);
		}
		console.log(response);
	};
	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course Description
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
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialValues.description && "text-slate-500 italic"
					)}>
					{initialValues.description || "No description"}
				</p>
			)}{" "}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 mt-4'>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											placeholder='e.g This course is about...'
											{...field}
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
