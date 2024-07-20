"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { LectureItem } from "../_components/LectureItem";
import { useState, useEffect, useRef } from "react";
import {
  type courseProgress,
  defaultCourseProgress,
  defaultLecture,
  type lectureType,
} from "@/lib/types";
import axios from "axios";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, VideoIcon } from "lucide-react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Course() {
  const [updating, setUpdating] = useState(false);
  const { course_id } = useParams();
  const searhParams = useSearchParams();
  const isLive = searhParams.get("isLive") === "true";
  const [lectures, setLectures] = useState<lectureType[]>([]);
  const [currLecture, setCurrLecture] = useState<lectureType>(defaultLecture);
  const [loading, setLoading] = useState(true);
  const [lecturesCompleted, setLecturesCompleted] = useState(0);
  const [progress, setProgress] = useState<courseProgress>(
    defaultCourseProgress,
  );
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get(`/api/courses/myCourses/${course_id}`);
        const progressResponse = await axios.get(
          `/api/courseProgress/${course_id}`,
        );
        const progressData: courseProgress = progressResponse.data.data;
        console.log(progressResponse.data.data);
        const data = response.data.data;

        setProgress(progressData);
        setLectures(data);
        setLecturesCompleted(
          Math.floor(
            (progressData.completedLectures.length / data.length) * 100,
          ),
        );

        if (data.length > 0) {
          setCurrLecture(
            data.find(
              (l: lectureType) =>
                String(l.lecture_id) === progressData.lastLecture,
            ),
          );
        }
        setLoading(false);
        console.log(data);
      } catch {
        router.push("/");
      }
    }
    init();
  }, [course_id, router]);

  const changeLecture = async (lecture: lectureType) => {
    const response = await axios.put(`/api/courseProgress/${course_id}`, {
      id: progress.id,
      lastLecture: String(lecture.lecture_id),
      completedLectures: { data: progress.completedLectures },
      user_id: progress.user_id,
    });
    console.log(response.data);
    setCurrLecture(lecture);
    setProgress(response.data.data);
  };
  const completeLecture = async () => {
    console.log(progress);

    if (progress.completedLectures.includes(String(currLecture.lecture_id)))
      return;
    try {
      setUpdating(true);
      const response = await axios.put(`/api/courseProgress/${course_id}`, {
        id: progress.id,
        lastLecture: progress.lastLecture,
        completedLectures: {
          data: [...progress.completedLectures, String(currLecture.lecture_id)],
        },
        user_id: progress.user_id,
      });
      const progressData = response.data.data;
      setProgress(progressData);
      setLecturesCompleted(
        Math.floor(
          (progressData.completedLectures.length / lectures.length) * 100,
        ),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };
  console.log(currLecture);
  const allLectures = lectures?.map((lecture) => (
    <LectureItem
      key={lecture.lecture_id}
      lecture={lecture}
      changeLecture={changeLecture}
      completed={progress.completedLectures.includes(
        String(lecture.lecture_id),
      )}
    />
  ));
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-2 border">
        <div className="mt-2 px-5">
          <Progress value={lecturesCompleted} />
          <p className="font-semibold text-sky-800 text-center mt-2 mb-4">
            Completed {lecturesCompleted}%
          </p>
        </div>
        <Separator className="mt-2" />

        {allLectures}
      </div>
      <div className="col-span-10 border flex flex-col items-center">
        <div className="w-[90%] flex flex-col items-end">
          <Button
            className="mt-1 w-fit"
            onClick={completeLecture}
            disabled={updating}
          >
            <Check className="mr-2 w-4 h-4" />
            {progress.completedLectures.includes(String(currLecture.lecture_id))
              ? "Completed"
              : "Mark as complete"}
          </Button>
          <Separator className="my-2" />
        </div>
        {!loading && !isLive && (
          <div className="w-[90%] flex flex-col items-end">
            <CldVideoPlayer
              key={currLecture.lecture_id}
              id={currLecture.lecture_id}
              src={currLecture.video?.url || "Not found"}
              width={1920}
              height={1080}
              logo={false}
              onEnded={completeLecture}
            />
          </div>
        )}
        {!loading && isLive && (
          <div className="mt-5 flex space-x-4 justify-center">
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
