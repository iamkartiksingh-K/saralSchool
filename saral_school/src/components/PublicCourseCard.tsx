import type { courseType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
export function PublicCourseCard({
  course,
  showCourse,
}: {
  course: courseType;
  showCourse: (course_id: string) => void;
}) {
  return (
    <Card
      className="w-64 cursor-pointer"
      onClick={() => showCourse(course.course_id)}
    >
      <CardContent className="flex flex-col items-center justify-center p-1">
        <Image
          className="rounded-lg w-full h-48 object-cover bg-gray-100"
          width={200}
          height={50}
          alt={course.name}
          src={course.thumbnail?.url || "/thumbnail-placeholder.png"}
        />
        <div className="flex flex-col items-start mt-3 w-full px-2 mb-3">
          <p className="text-base font-semibold ">{course.name}</p>
          <p className="text-gray-600 text-xs font-medium">
            {" "}
            {course.instructor?.fullName}
          </p>
          <Badge
            variant={course.isLive ? "destructive" : "secondary"}
            className={cn("mt-2")}
          >
            {course.isLive ? "Live" : "Recorded"}
          </Badge>
          <p className="font-semibold mt-3">Rs.{course.price}</p>
        </div>
      </CardContent>
    </Card>
  );
}
