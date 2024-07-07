import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
	title: "saralSchool | Instructor",
	description: "Instructor Dashboard",
};

export default function InstructorLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={"h-full"}>
			{children}
			<Toaster />
		</div>
	);
}
