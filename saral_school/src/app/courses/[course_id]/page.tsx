"use client";
import { useParams } from "next/navigation";

export default function ShowCourse() {
  const { course_id } = useParams();
  console.log(course_id);
  return <div>course details</div>;
}
