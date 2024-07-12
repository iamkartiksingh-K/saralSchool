"use client";
import type { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import signupSchema from "@/schema/signupSchema";
import { useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      isInstructor: false,
    },
  });
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
    setLoading(true);
    try {
      const response = await axios.post("api/users/signup", values);
      console.log(response);
      toast({
        title: response.data.message,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: error.response?.data.message,
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className={cn("w-[380px]")}>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Let&apos;s get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="John@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isInstructor"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Are you an instructor?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {loading ? <LoadingSpinner /> : "Sign up"}
            </Button>
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm">
                Already have an account?
                <Link href={"/login"} className="text-blue-600">
                  {" "}
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
