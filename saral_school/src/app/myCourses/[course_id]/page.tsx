"use client";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { LectureItem } from "../_components/LectureItem";
import { useState, useEffect, useRef } from "react";
import { defaultLecture, type lectureType } from "@/lib/types";
import axios from "axios";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

export default function Course() {
  const { course_id } = useParams();
  const [lectures, setLectures] = useState<lectureType[]>([]);
  const [currLecture, setCurrLecture] = useState<lectureType>(defaultLecture);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  console.log(playerRef);
  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get(`/api/courses/myCourses/${course_id}`);
        const data = response.data.data;
        setLectures(data);
        console.log(data);
        if (data.length > 0) {
          setCurrLecture(data[0]);
        }
        setLoading(false);
        console.log(data);
      } catch {
        router.push("/");
      }
    }
    init();
  }, [course_id, router]);

  // useEffect(() => {
  //   videoRef.current?.load();
  // }, [currLecture]);

  const changeLecture = (lecture: lectureType) => {
    setCurrLecture(lecture);
  };
  const allLectures = lectures?.map((lecture) => (
    <LectureItem
      key={lecture.lecture_id}
      lecture={lecture}
      changeLecture={changeLecture}
    />
  ));
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-2 border">{allLectures}</div>
      <div className="col-span-10 border flex justify-center item-start">
        {!loading && (
          <div className="w-[98%] p-5">
            <CldVideoPlayer
              key={currLecture.lecture_id}
              id={currLecture.lecture_id}
              src={currLecture.video?.url || "Not found"}
              width={1920}
              height={1080}
              logo={false}
              videoRef={videoRef}
              playerRef={playerRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}
