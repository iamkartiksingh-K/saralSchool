import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "saralSchool | courses",
  description: "View the details of the course",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
