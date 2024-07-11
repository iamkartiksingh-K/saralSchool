export interface imageType {
	image_id: string;
	url: string;
}
export interface userDataType {
	user_id: string;
	username: string;
	email: string;
	isInstructor: boolean;
	bio?: string;
	headline?: string;
	avatar?: imageType;
	fullName: string;
}

export const defaultUser: userDataType = {
	user_id: "",
	username: "",
	email: "",
	fullName: "",
	isInstructor: false,
};

export interface videoType {
	video_id: string;
	url: string;
	public_id?: string;
}
export const defaultVideo: videoType = {
	video_id: "",
	url: "",
	public_id: "",
};
export interface lectureType {
	lecture_id: string;
	name: string;
	isFree: boolean;
	video?: videoType;
	contentLink?: string;
	publishedAt: Date | null;
	course_id: string;
	position?: number;
}
export const defaultLecture: lectureType = {
	lecture_id: "",
	name: "",
	isFree: false,
	publishedAt: null,
	course_id: "",
};

export interface courseType {
	course_id: string;
	name: string;
	description?: string | null;
	rating?: number | null;
	price: number;
	thumbnail?: imageType | null;
	isLive?: boolean | null;
	instructor?: userDataType;
	students?: Array<userDataType>;
	lectures?: Array<lectureType>;
	category?: string | null;
	publishedAt: Date | null;
}
export const defaultCourse: courseType = {
	course_id: "",
	name: "",
	publishedAt: null,
	price: 0,
};
