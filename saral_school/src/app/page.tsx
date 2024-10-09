"use client";
import { UserDataContext } from "@/contexts/userDataContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import type { courseType } from "@/lib/types";
import { PublicCourseCard } from "@/components/PublicCourseCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  const { user, setUser } = useContext(UserDataContext);
  const [courses, setCourses] = useState<courseType[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data.data);
      } catch {
        console.log("some error");
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const meResponse = await axios.get("/api/users/me");
        setUser(meResponse.data.data);
      } catch {
        console.log("some error");
      }
    }
    init();
  }, [setUser]);
  const showCourse = (course_id: string) => {
    router.push(`/courses/${course_id}`);
  };
  const allCourseCards = courses.map((course) => (
    <PublicCourseCard
      key={course.course_id}
      course={course}
      showCourse={showCourse}
    />
  ));

  return (
    <main className="container py-3">
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {user.fullName
              ? `Welcome back, ${user.fullName}`
              : "Welcome to SaralSchool"}
          </h1>
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent>
              <CarouselItem>
                  <Image
                width={1536}
                height={400}
                src={"/banner.jpg"}
                alt="hero"
                className="w-full h-96 bg-gray-100 rounded-md object-cover border"
              />
              </CarouselItem>
              <CarouselItem>
                <Image
              width={1536}
              height={400}
              src={"/banner1.jpg"}
              alt="hero"
              className="w-full h-96 bg-gray-100 rounded-md object-cover border"
            />
              </CarouselItem>
              <CarouselItem>
                  <Image
                width={1536}
                height={400}
                src={"/banner2.jpg"}
                alt="hero"
                className="w-full h-96 bg-gray-100 rounded-md object-cover border"
              />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="flex flex-col space-y-3 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 ">All Courses</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{allCourseCards}</div>
      </div>
    </main>
  );
}
