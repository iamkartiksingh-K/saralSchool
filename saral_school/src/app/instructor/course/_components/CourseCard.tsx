import type { courseType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dot, Pencil, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const formSchema = z.object({
  email: z
    .string()
    .regex(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Enter a valid email",
    ),
});

export default function CourseCard({ course }: { course: courseType }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await axios.post(
        `/api/courses/${course.course_id}/addStudent`,
        {
          data: {
            email: values.email,
          },
        },
      );
      console.log(response);
      toast({
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const edit = () => {
    router.push(`/instructor/course/${course.course_id}/`);
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col items-center justify-center p-1 ">
        <Image
          className="rounded-lg w-full h-48 object-cover bg-gray-100"
          width={200}
          height={50}
          alt={course.name}
          src={course.thumbnail?.url || "/thumbnail-placeholder.png"}
        />
        <div className="flex flex-col justify-between items-start mt-4 w-full px-5 space-y-3 ">
          <p className="text-base font-semibold h-14 flex flex-col">
            {course.name}
            <Badge variant={"secondary"} className="h-6 w-fit mt-1">
              {course.publishedAt && <Dot className="text-green-600" />}
              {course.publishedAt ? "Published" : "Draft"}
            </Badge>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-9 space-x-2">
        <Button
          className={!course.publishedAt ? "w-full" : ""}
          variant={"default"}
          onClick={edit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        {course.publishedAt && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="" variant={"outline"}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Student</DialogTitle>
                <DialogDescription>
                  Search for student using email address.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="kartik@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Add</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
