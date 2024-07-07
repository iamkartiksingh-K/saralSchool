"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { userDataType } from "@/lib/types";
import { useEffect } from "react";
import axios from "axios";
import { defaultUser } from "@/lib/types";
interface contextType {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	user: userDataType;
	setUser: Dispatch<SetStateAction<userDataType>>;
}
const defaultValues: contextType = {
	isLoggedIn: false,
	setIsLoggedIn: () => null,
	user: defaultUser,
	setUser: () => null,
};

export const UserDataContext = createContext<contextType>(defaultValues);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<userDataType>(defaultUser);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	useEffect(() => {
		try {
			const init = async () => {
				try {
					const response = await axios.get("/api/users/me");
					console.log(response.data.data);
					if (response.status === 200) {
						setUser(response.data.data);
					}
					console.log(response);
				} catch (error: any) {
					console.log(error);
				}
			};
			init();
		} catch (error: any) {
			console.log(error.response?.data.message);
		}
	}, [isLoggedIn]);
	return (
		<UserDataContext.Provider
			value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
			{children}
		</UserDataContext.Provider>
	);
}
