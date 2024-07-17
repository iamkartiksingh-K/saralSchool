import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "saralSchool | my courses",
  description: "all your purchased courses are here",
};

export default function MyCoursesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
