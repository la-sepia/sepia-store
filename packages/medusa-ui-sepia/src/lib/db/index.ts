import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const db = (DATABASE_URL: string) => drizzle(postgres(DATABASE_URL));
