import { z } from "zod";
const signupSchema = z.object({
	email: z
		.string()
		.regex(
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
			"Enter a valid email"
		),
	password: z
		.string()
		.min(6, { message: "password should be atleast 6 characters long" }),
	fullName: z
		.string()
		.min(3, { message: "Name should be atleas 3 characters long" }),
});
export default signupSchema;
