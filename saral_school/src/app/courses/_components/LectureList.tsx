import type { lectureType } from "@/lib/types";
import { ListItem } from "./ListItem";
import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction } from "react";
export function LectureList({
  lectures,
  className,
}: {
  lectures: lectureType[] | undefined;
  className?: string;
}) {
  const renderedLectures = lectures?.map((lecture) => (
    <ListItem key={lecture.lecture_id} lecture={lecture} />
  ));
  return (
    <div className={cn("border rounded-md shadow", className)}>
      {renderedLectures}
    </div>
  );
}
