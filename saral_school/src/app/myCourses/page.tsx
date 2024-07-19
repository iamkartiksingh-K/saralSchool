"use client";
import { UserDataContext } from "@/contexts/userDataContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import type { courseType } from "@/lib/types";
import { PublicCourseCard } from "@/components/PublicCourseCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
export default function MyCourses() {
  const { user } = useContext(UserDataContext);
  const [courses, setCourses] = useState<courseType[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function init() {
      const response = await axios.get("/api/courses/myCourses");
      setCourses(response.data.data);
      console.log(response.data);
    }
    init();
  }, []);

  const showCourse = (course_id: string, isLive: boolean) => {
    router.push(`/myCourses/${course_id}?isLive=${isLive}`);
  };
  const allCourseCards = courses.map((course) => (
    <PublicCourseCard
      key={course.course_id}
      course={course}
      showCourse={showCourse}
    />
  ));
  return (
    <div className="container pt-10">
      <div className="flex flex-col space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
        <Separator className="my-3" />
        <div className="flex space-x-3">{allCourseCards}</div>
      </div>
    </div>
  );
}
