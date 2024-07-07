import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./Providers";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "saralSchool",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={"h-screen flex flex-col "}>
				<Providers>
					<Navbar />
					<main className='grow'>
						{children}
						<Toaster />
					</main>
				</Providers>
			</body>
		</html>
	);
}
