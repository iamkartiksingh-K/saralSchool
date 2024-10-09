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
import { usePathname } from "next/navigation";

export function PublicCourseCard({
  course,
  showCourse,
}: {
  course: courseType;
  showCourse: (course_id: string, isLive: boolean) => void;
}) {
  const path = usePathname();
  console.log(path);
  return (
    <Card
      className="cursor-pointer mt-3"
      onClick={() => showCourse(course.course_id, course.isLive || false)}
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
          <div className="h-14 mb-2">
            <p className="text-base font-semibold">{course.name}</p>
            <p className="text-gray-600 text-xs font-medium">
              {" "}
              {course.instructor?.fullName}
            </p>
          </div>
          <Badge
            variant={course.isLive ? "destructive" : "secondary"}
            className={"mt-4"}
          >
            {course.isLive ? "Live" : "Recorded"}
          </Badge>
          {path !== "/myCourses" && (
            <p className="font-semibold mt-3">Rs.{course.price}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
