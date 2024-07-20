import type { courseType, lectureType } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import type { Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";
export function LectureItem({
  lecture,
  changeLecture,
  completed,
}: {
  lecture: lectureType;
  changeLecture: (lecture: lectureType) => void;
  completed: boolean;
}) {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        changeLecture(lecture);
      }}
      onKeyDown={() => null}
    >
      <p className="font-semibold truncate h-10 pl-2 flex items-center justify-between">
        {lecture.name}
        {completed && (
          <Check className="w-4 h-4 mr-2 text-sky-800 font-medium" />
        )}
      </p>
      <Separator />
    </div>
  );
}
