import { auth } from "@/lib/auth"; // তোমার auth.js এর path
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);