"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "@/contexts/userDataContext";
import { userDataType } from "@/lib/types";
import { Button } from "./ui/button";
import axios from "axios";
import { disableList } from "@/lib/disableNavAndFooter";
import { usePathname } from "next/navigation";
import { defaultUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
interface props {
	user: userDataType;
	isLoggedIn: boolean;
	setIsLoggedIn: any;
	setUser: any;
}

export default function Navbar() {
	const { user, isLoggedIn, setIsLoggedIn, setUser }: props =
		useContext(UserDataContext);
	const [student, setStudent] = useState(true);
	const router = useRouter();
	const path = usePathname();
	useEffect(() => {
		if (path.split("/").includes("instructor")) setStudent(false);
		else setStudent(true);
	}, [path]);
	const logout = async () => {
		try {
			const response = await axios.get("/api/users/logout");
			setIsLoggedIn(false);
			setUser(defaultUser);
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};
	const changeView = () => {
		const path = student ? "/instructor" : "/";
		router.push(path);
	};
	return (
		<>
			{!disableList.includes(path) && (
				<div className='flex justify-between py-2 px-4 border'>
					<div>
						<Logo />
					</div>
					<div className='flex items-center'>
						{user?.user_id && (
							<Button
								onClick={changeView}
								variant={"link"}
								className='font-semibold mr-3 text-md'>
								{student ? "Instructor" : "Student"}
							</Button>
						)}
						{user.user_id ? (
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar>
										<AvatarImage
											src={`${user?.avatar?.url}`}
										/>
										<AvatarFallback>
											{user?.fullName[0] || "U"}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel className='font-normal'>
										<p className='font-semibold'>
											{user.fullName}
										</p>
										<p className='text-xs text-muted-foreground'>
											{user.email}
										</p>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Link href={"#"}>My Courses</Link>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Link href={"#"}>Cart</Link>
									</DropdownMenuItem>

									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={logout}
										className='cursor-pointer text-red-600 font-medium'>
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className='space-x-3'>
								<Button variant={"outline"} asChild>
									<Link href={"/login"}>Log in</Link>
								</Button>
								<Button variant={"outline"} asChild>
									<Link href={"/signup"}>Sign up</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
