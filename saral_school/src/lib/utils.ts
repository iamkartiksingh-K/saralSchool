import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { imageType } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getImageObj(image: any, type: string): imageType {
	console.log(image);
	const imageObj = {
		image_id: "",
		url: "",
	};
	if (!image) return imageObj;
	if (image.attributes) {
		const { id, attributes } = image;
		const { formats, url: baseURL } = attributes;
		imageObj.image_id = id;
		if (formats[type]) {
			imageObj.url = formats[type].url;
		} else imageObj.url = baseURL;
		return imageObj;
	}
	const {
		id,
		formats,
		url: baseURL,
	}: { id: string; formats: { [key: string]: any }; url: string } = image;
	imageObj.image_id = id;
	if (formats[type]) {
		imageObj.url = formats[type].url;
	} else imageObj.url = baseURL;
	return imageObj;
}
