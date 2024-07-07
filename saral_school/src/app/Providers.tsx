"use client";
import { UserDataProvider } from "@/contexts/userDataContext";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
	return <UserDataProvider>{children}</UserDataProvider>;
}
