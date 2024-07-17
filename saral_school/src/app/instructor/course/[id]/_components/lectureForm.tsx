"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import type { courseType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LectureList } from "./lectureList";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  lecture: z.string().min(1, { message: "Lecture is required" }),
});

interface LectureFormProps {
  isLive: boolean;
  courseId: string;
  setCourse: Dispatch<SetStateAction<courseType>>;
  course: courseType;
}

export const LectureForm = ({
  isLive,
  courseId,
  setCourse,
  course,
}: LectureFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const toggleCreating = () => setIsCreating((current) => !current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lecture: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      // if (lectures?.length) {
      // 	lectures?.sort((a: any, b: any) => a.position - b.position);
      // }
      const response = await axios.post(`/api/courses/${courseId}/lectures`, {
        lecture: values.lecture,
        courseId: courseId,
        position: course.lectures?.length,
      });
      const lectures = course.lectures;
      const data = response?.data?.data;
      lectures?.push(data);
      setCourse({ ...course, lectures: lectures });
      toggleCreating();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onReorder = async (
    updatedData: { lecture_id: string; position: number }[],
  ) => {
    try {
      setIsUpdating(true);
      const data = {
        lectures: updatedData.map((data) => {
          return {
            lecture_id: data.lecture_id,
            position: data.position,
          };
        }),
      };
      console.log("array of data", data);
      const response = await axios.put(
        `/api/courses/${courseId}/lectures/reorder`,
        data,
      );
      console.log(course.lectures);
      router.refresh();
    } catch (error) {
      console.log("error in re-ordering");
    } finally {
      setIsUpdating(false);
    }
  };
  const onEdit = async (lecture_id: string) => {
    router.push(
      `/instructor/course/${courseId}/lectures/${lecture_id}?isLive=${course.isLive}`,
    );
  };
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Lectures
        <Button variant={"ghost"} onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
            </>
          )}
        </Button>
      </div>
      {!isCreating && (
        <div>
          <p
            className={cn(
              "text-sm mt-2",
              !course.lectures?.length && "text-slate-500 italic",
            )}
          >
            {!course.lectures?.length && "No lectures"}
          </p>
          <LectureList
            onEdit={onEdit}
            onReorder={onReorder}
            items={course.lectures || []}
          />
          <p className="text-sm text-slate-500 italic">
            Drag and drop to reorder lectures
          </p>
        </div>
      )}{" "}
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="lecture"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Introduction to Web dev"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
