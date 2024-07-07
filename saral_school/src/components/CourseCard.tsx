import { courseType } from "@/lib/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
export default function CourseCard({ course }: { course: courseType }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{course.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<Image alt={course.name} src={course.thumbnail?.url || ""} />
			</CardContent>
			<CardFooter>
				<Button>Edit</Button>
			</CardFooter>
		</Card>
	);
}
