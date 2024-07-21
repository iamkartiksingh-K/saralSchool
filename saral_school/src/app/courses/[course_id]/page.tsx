"use client";
import {
  defaultCourse,
  defaultLecture,
  type lectureType,
  type courseType,
} from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CloudinaryVideoPlayer } from "next-cloudinary";
import { User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { LectureList } from "../_components/LectureList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ShowCourse() {
  const { course_id } = useParams();
  const [course, setCourse] = useState<courseType>(defaultCourse);
  const [preview, setPreview] = useState<lectureType>(defaultLecture);
  const [loading, setLoading] = useState(true);
  const [bought, setBought] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get(`/api/courses/${course_id}`);
        const data = response.data.data;
        const lectureResponse = await axios.get(
          `/api/courses/${course_id}/lectures/${data.lectures[0].lecture_id}`,
        );
        const boughtResponse = await axios.get(
          `/api/courses/${course_id}/buyCourse`,
        );
        console.log(boughtResponse);
        setBought(boughtResponse.data.message === "bought");
        setPreview(lectureResponse.data.data);
        setCourse(data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [course_id]);
  const buyCourse = async () => {
    console.log();
    if (!bought) {
      try {
        setSubmitting(true);
        const buyResponse = await axios.post(
          `/api/courses/${course_id}/buyCourse`,
        );
        setBought(true);
      } catch (error) {
        console.log(error);
        router.push("/");
      } finally {
        setSubmitting(false);
      }
    } else {
      router.push(`/myCourses/${course_id}?isLive=${course.isLive}`);
    }
  };
  console.log(preview);
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
              {!course.isLive && (
                <p className="text-sm font-semibold flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {course.lectures?.length} Lectures
                </p>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-24 font-semibold rounded-sm"
            onClick={buyCourse}
            disabled={submitting}
          >
            {bought ? "Go to Course" : "Buy Course"}
          </Button>
        </div>
      </div>
      <div className="container pt-8">
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="text-justify">{course.description}</p>
          </div>
          <div>
            {!loading && !course.isLive && (
              <CldVideoPlayer
                width="1920"
                height="1080"
                src={preview.video?.url || "something"}
                id={`${preview.lecture_id}-1`}
                logo={false}
              />
            )}
            {!loading && course.isLive && (
              <Image
                src={course.thumbnail?.url || "/thumbnail-placeholder.png"}
                alt={course.name}
                width="1920"
                height="1080"
                className="rounded-sm"
              />
            )}
          </div>
        </div>
        {!course.isLive && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold">Lectures</h2>
            {!loading && (
              <LectureList lectures={course.lectures} className="mt-5" />
            )}
          </div>
        )}
        <div className="mt-12 mb-4">
          <h2 className="text-2xl font-semibold">Instructor</h2>
          <div className="mt-7">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={course.instructor?.avatar?.url} />
                <AvatarFallback>
                  {course.instructor?.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold">{course.instructor?.fullName}</p>
                <p className="text-sm">{course.instructor?.headline}</p>
              </div>
            </div>
            <p className="mt-3 ml-12">{course.instructor?.bio}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-20 mt-7" />
    </div>
  );
}
