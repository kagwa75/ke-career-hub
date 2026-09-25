import { createServerFn } from "@tanstack/react-start";

import { sql } from "./db.server";

type NeonHealthRow = {
  server_time: string;
};

export const checkNeonConnection = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql`
    select now()::text as server_time
  `;
  const [row] = rows as NeonHealthRow[];

  if (!row) {
    throw new Error("Neon health check returned no rows.");
  }

  return {
    ok: true,
    serverTime: row.server_time,
  };
});
