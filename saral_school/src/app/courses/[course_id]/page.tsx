"use client";
import { defaultCourse, type courseType } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CloudinaryVideoPlayer } from "next-cloudinary";
import { User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
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
      <div className="bg-slate-800 text-white h-1/4 py-5">
        <div className="container flex flex-col justify-between h-full">
          <div>
            <h1 className="text-3xl font-semibold">{course.name}</h1>
            <div className="flex items-center space-x-5 mt-3">
              <p className="text-sm font-semibold flex items-center">
                <User className="h-4 w-4 mr-2" /> {course.instructor?.fullName}
              </p>
              <p className="text-sm font-semibold flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {course.lectures?.length} Lectures
              </p>
            </div>
          </div>

          <Button variant="secondary" className="w-24 font-semibold rounded-sm">
            Buy Course
          </Button>
        </div>
      </div>
      <div className="container pt-8">
        <div className="mt-8 grid grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">About</h2>
            <p>{course.description}</p>
          </div>
          <div>
            <CldVideoPlayer width="1920" height="1080" src="something" />
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">Lectures</h2>
        </div>
      </div>
    </div>
  );
}
