"use client";
import type { Dispatch, SetStateAction } from "react";
import type { lectureType } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  contentLink: z.string().url(),
});

interface ContentLinkProps {
  initialValues: {
    contentLink: string;
  };
  course_id: string;
  lecture_id: string;
  setLecture: Dispatch<SetStateAction<lectureType>>;
}

export function ContentLinkForm({
  initialValues,
  course_id,
  lecture_id,
  setLecture,
}: ContentLinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentLink: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await axios.put(
      `/api/courses/${course_id}/lectures/${lecture_id}`,
      {
        contentLink: values.contentLink,
      },
    );
    const data = response?.data?.data;
    if (data) {
      toggleEdit();
      setLecture(data);
    }
    console.log(response);
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Content link
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
      {!isEditing && <p className="truncate">{initialValues.contentLink}</p>}{" "}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="contentLink"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="meet.google.com"
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
}
