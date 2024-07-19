"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { LectureItem } from "../_components/LectureItem";
import { useState, useEffect, useRef } from "react";
import { defaultLecture, type lectureType } from "@/lib/types";
import axios from "axios";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { Button } from "@/components/ui/button";
import { Download, VideoIcon } from "lucide-react";
import Link from "next/link";

export default function Course() {
  const { course_id } = useParams();
  const searhParams = useSearchParams();
  const isLive = searhParams.get("isLive") === "true";
  console.log(isLive);
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

  const changeLecture = (lecture: lectureType) => {
    setCurrLecture(lecture);
  };
  console.log(currLecture);
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
        {!loading && !isLive && (
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
        {!loading && isLive && (
          <div className="mt-5 w-1/2 flex space-x-4 justify-center">
            {currLecture.classLink && (
              <Link href={currLecture.classLink} target="_blank">
                <Button>
                  <VideoIcon className="mr-3 h-4 w-4 text-red-400" />
                  Join Class
                </Button>
              </Link>
            )}
            {currLecture.contentLink && (
              <Link href={currLecture.contentLink} target="_blank">
                <Button>
                  {" "}
                  <Download className="mr-3 h-4 w-4" />
                  Download Resources
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
