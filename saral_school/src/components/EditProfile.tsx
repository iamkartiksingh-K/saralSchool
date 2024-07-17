"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { UserDataContext } from "@/contexts/userDataContext";

// const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  bio: z.string(),
  headline: z.string(),
  avatar: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })
    .refine((files) => {
      if (files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type || "");
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
  fullName: z.string(),
});
export default function EditProfile() {
  const { user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: user?.bio,
      headline: user?.headline,
      fullName: user?.fullName,
      avatar: undefined,
    },
  });
  const fileRef = form.register("avatar");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const formData = new FormData();
      if (values.avatar) {
        formData.append("avatar", values?.avatar?.[0] || "");
        formData.append("image_id", user.avatar?.image_id || "");
      }

      formData.append("headline", values?.headline || "");
      formData.append("bio", values?.bio || "");
      formData.append("user_id", user.user_id);
      formData.append("fullName", values?.fullName || "");
      setLoading(true);
      const response = await axios.put("/api/users/updateUser", formData);
      if (response?.data) {
        toast({
          title: response?.data.message,
        });
        const data = response.data.data;
        // console.log({ ...user, ...data });
        setUser({ ...user, ...data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log(values);
  }
  return (
    <div className="w-full">
      <h2 className="text-2xl font-medium">Profile</h2>
      <Separator className="my-3" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...fileRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files?.[0] ?? "");
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is the avatar that will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                {/* <FormDescription>
									Use this field to highlight your experience
									and qualifications
								</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Web Developer with 2+ years of experience"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use this field to highlight your experience and qualifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea className="h-40" {...field} />
                </FormControl>
                <FormDescription>
                  Briefly tell students about your background and expertise.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-10 w-32">
            {loading ? <LoadingSpinner /> : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
