"use client";
import SideNavbar from "@/app/instructor/course/_components/SideNavbar";
import EditProfile from "@/components/EditProfile";
import InstructorCourse from "@/app/instructor/course/_components/InstructorCourses";
import { useState } from "react";

export default function InstructorDashboard() {
	const [option, setOption] = useState("instructorCourse");
	const options: { [key: string]: React.ReactNode } = {
		editProfile: <EditProfile />,
		instructorCourse: <InstructorCourse />,
	};
	return (
		<div className='flex w-full h-full '>
			<SideNavbar setOption={setOption} selected={option} />
			<div className='container py-3'>{options[option]}</div>
		</div>
	);
}
