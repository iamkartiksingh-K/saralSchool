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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { courseType } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	category: z.string().min(1),
});

interface CategoryFormProps {
	initialValues: {
		category: string | null | undefined;
	};
	courseId: string;
	setCourse: Dispatch<SetStateAction<courseType>>;
}
const categories = [
	"Web Development",
	"Business",
	"Design",
	"Marketing",
	"Photography & Video",
	"Health & Fitness",
	"Music",
	"Teaching & Academics",
	"Computer Science",
	"Android Development",
	"Data Science",
];
export const CategoryForm = ({
	initialValues,
	courseId,
	setCourse,
}: CategoryFormProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { category: initialValues.category || "" },
	});

	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		const response = await axios.put(`/api/courses/${courseId}`, {
			category: values.category,
		});
		const data = response?.data?.data;
		if (data) {
			setIsEditing(false);
			setCourse(data);
		}
		console.log(response);
	};
	const renderCategories = categories.map((category) => {
		return (
			<SelectItem key={category} value={category}>
				{category}
			</SelectItem>
		);
	});

	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course Category
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
						!initialValues.category && "text-slate-500 italic"
					)}>
					{initialValues.category || "No category selected"}
				</p>
			)}{" "}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 mt-4'>
						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a category' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{renderCategories}
										</SelectContent>
									</Select>

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
