"use client";
import { defaultCourse, type courseType } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CloudinaryVideoPlayer } from "next-cloudinary";

export default function ShowCourse() {
  const { course_id } = useParams();
  const [course, setCourse] = useState<courseType>(defaultCourse);
  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get(`/api/courses/${course_id}`);
        console.log(response.data.data);
        setCourse(response.data.data);
      } catch (error: any) {
        console.log(error);
      }
    }
    init();
  }, [course_id]);
  return (
    <div className="h-dvh">
      <div className="container pt-8">
        <div>
          <h1 className="text-3xl font-semibold">{course.name}</h1>
          <p className="text-sm font-medium">
            By {course.instructor?.fullName}
          </p>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">About</h2>
        </div>
      </div>
    </div>
  );
}
