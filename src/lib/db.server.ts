import "@tanstack/react-start/server-only";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for server-side Neon database access.");
}

export const sql = neon(databaseUrl);
