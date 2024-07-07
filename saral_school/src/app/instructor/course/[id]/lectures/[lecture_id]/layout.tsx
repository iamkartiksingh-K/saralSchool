import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "saralSchool | Edit lecture",
	description: "Edit your lecture",
};

export default function LectureLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={"h-full"}>{children}</div>;
}
