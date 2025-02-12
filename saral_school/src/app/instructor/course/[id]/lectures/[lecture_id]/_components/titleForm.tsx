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
import { Pencil } from "lucide-react";
import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import type { courseType, lectureType } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
});

interface LectureTitleFormProps {
  initialValues: {
    title: string;
  };
  course_id: string;
  lecture_id: string;
  setLecture: Dispatch<SetStateAction<lectureType>>;
}

export const LectureTitleForm = ({
  initialValues,
  lecture_id,
  course_id,
  setLecture,
}: LectureTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const response = await axios.put(
      `/api/courses/${course_id}/lectures/${lecture_id}`,
      {
        name: values.title,
      },
    );
    const data = response?.data?.data;
    if (data) {
      toggleEdit();
      setLecture(data);
    }
    console.log(response);
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lecture Name
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p>{initialValues.title}</p>}{" "}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g Advance web dev"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
