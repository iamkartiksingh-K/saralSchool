import { z } from "zod";
const loginSchema = z.object({
	identifier: z.string().min(1, "Enter email"),
	password: z.string().min(1, "Enter password"),
});
export default loginSchema;
