import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign up",
	description: "Sign up to enjoy our website",
};

export default function SignupLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={"w-full h-full flex justify-center items-center"}>
			{children}
		</div>
	);
}
