import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "saralSchool | Create course",
	description: "Create new course",
};

export default function InstructorLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={"h-full"}>{children}</div>;
}
