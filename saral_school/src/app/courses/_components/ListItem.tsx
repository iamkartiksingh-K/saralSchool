import { defaultLecture, type lectureType } from "@/lib/types";
import { Lock, Unlock } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CldVideoPlayer } from "next-cloudinary";

export function ListItem({ lecture }: { lecture: lectureType }) {
  const [displayLecture, setDisplayLecture] =
    useState<lectureType>(defaultLecture);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const changePreview = async () => {
    if (!lecture.isFree) return;
    try {
      const response = await axios.get(
        `/api/courses/${lecture.course_id}/lectures/${lecture.lecture_id}`,
      );
      console.log(response.data.data);
      setDisplayLecture(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const change = (val: boolean) => {
    lecture.isFree ? setOpen(val) : setOpen(false);
  };
  return (
    <div className="border-b-2 p-2 flex items-center font-medium">
      {lecture.isFree ? (
        <Unlock className="h-4 w-4 mr-2" />
      ) : (
        <Lock className="h-4 w-4 mr-2" />
      )}
      <Dialog open={open} onOpenChange={change}>
        <DialogTrigger asChild>
          <span
            onClick={changePreview}
            className={cn(
              "cursor-pointer",
              lecture.isFree && "hover:underline hover:text-sky-600",
            )}
          >
            {lecture.name}
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lecture.name}</DialogTitle>
          </DialogHeader>
          {!loading && (
            <CldVideoPlayer
              width={1920}
              height={1080}
              src={displayLecture.video?.url || "something"}
              id={displayLecture.lecture_id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
