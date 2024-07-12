"use client";
import { UserDataContext } from "@/contexts/userDataContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import type { courseType } from "@/lib/types";
import { PublicCourseCard } from "@/components/PublicCourseCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useContext(UserDataContext);
  const [courses, setCourses] = useState<courseType[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function init() {
      const response = await axios.get("/api/courses");
      setCourses(response.data.data);
    }
    init();
  }, []);
  const showCourse = (course_id: string) => {
    router.push(`/courses/${course_id}`);
  };
  const allCourseCards = courses.map((course) => (
    <PublicCourseCard
      key={course.course_id}
      course={course}
      showCourse={showCourse}
    />
  ));

  return (
    <main className="container py-3">
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, {user.fullName}
          </h1>
          {/* <Image
            width={1536}
            height={400}
            src={"/wide-bg.jpg"}
            alt="hero"
            className="w-full h-96 bg-gray-100 rounded-md object-cover border"
          /> */}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 ">All Courses</h2>
        <div className="flex space-x-3">{allCourseCards}</div>
      </div>
    </main>
  );
}
