"use client";
import { UserDataContext } from "@/contexts/userDataContext";
import { useContext } from "react";
export default function Home() {
	const { user } = useContext(UserDataContext);
	return (
		<main>
			<p>Home page</p>
			<p>{user.username || "not logged in"}</p>
		</main>
	);
}
