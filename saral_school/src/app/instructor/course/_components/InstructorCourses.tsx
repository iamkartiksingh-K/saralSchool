"use client";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useContext } from "react";
import { UserDataContext } from "@/contexts/userDataContext";
import { useState, useEffect } from "react";
import { courseType, defaultCourse } from "@/lib/types";
import CourseCard from "./CourseCard";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	isLive: z.boolean(),
});
export default function InstructorCourse() {
	const [courses, setCourses] = useState<courseType[]>([]);
	const router = useRouter();
	const { user } = useContext(UserDataContext);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			isLive: false,
		},
	});
	useEffect(() => {
		async function init() {
			try {
				const response = await axios.get(
					`/api/courses/allCourses/${user.user_id}`
				);
				console.log(response);
				setCourses(response.data.data);
			} catch (error) {
				console.log(error);
			}
		}
		init();
	}, [router]);
	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		try {
			const response = await axios.post("api/courses", {
				...values,
				user_id: user.user_id,
			});
			form.reset({
				name: "",
				isLive: false,
			});
			const data = response?.data?.data;
			router.push(`/instructor/course/${data.course_id}`);
		} catch (error) {
			console.log(error);
		}
	}
	const allCourses = courses.map((course) => <CourseCard course={course} />);
	return (
		<div className='w-full'>
			<div className='w-full flex justify-between'>
				<h2 className='text-2xl font-medium'>Your courses</h2>

				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<FaPlus className='mr-3' />
							New Course
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Details</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-4'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Course Name</FormLabel>
											<FormControl>
												<Input
													placeholder='Web Development Bootcamp'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='isLive'
									render={({ field }) => (
										<FormItem className='flex flex-col'>
											<FormLabel>
												Is the course Live
											</FormLabel>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogClose asChild>
									<Button type='submit'>Create</Button>
								</DialogClose>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
			<Separator className='my-3' />
			<div className='flex space-x-3'>{allCourses}</div>
		</div>
	);
}
