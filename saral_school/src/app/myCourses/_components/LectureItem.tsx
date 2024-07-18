import type { courseType, lectureType } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import type { Dispatch, SetStateAction } from "react";
export function LectureItem({
  lecture,
  changeLecture,
}: {
  lecture: lectureType;
  changeLecture: (lecture: lectureType) => void;
}) {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        changeLecture(lecture);
      }}
      onKeyDown={() => null}
    >
      <p className="font-semibold truncate h-10 pl-2 flex items-center">
        {lecture.name}
      </p>
      <Separator />
    </div>
  );
}
