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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import loginSchema from "@/schema/loginSchema";
import { useState, useContext } from "react";
import { UserDataContext } from "@/contexts/userDataContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    setLoading(true);
    try {
      const response = await axios.post("api/users/login", values);
      setIsLoggedIn(true);
      router.push("/");
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
        <CardTitle>Log In</CardTitle>
        <CardDescription>Welcome Back 👋.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
            <Button className="w-full" type="submit">
              {loading ? <LoadingSpinner /> : "Login"}
            </Button>
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm">
                Don&apos;t have an account?
                <Link href={"/signup"} className="text-blue-600">
                  {" "}
                  Signup
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
