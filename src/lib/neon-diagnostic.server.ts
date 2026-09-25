import { neon } from "@neondatabase/serverless";
import { createServerFn } from "@tanstack/react-start";

type SanitizedError = {
  name: string;
  code?: string;
  message: string;
};

type NeonDiagnosticRow = {
  server_time: string;
};

export type NeonDiagnosticResult = {
  databaseUrlDefined: boolean;
  hostname: string | null;
  clientInitialized: boolean;
  querySucceeded: boolean;
  serverTime: string | null;
  error: SanitizedError | null;
};

export const getNeonDiagnostic = createServerFn({ method: "GET" }).handler(
  async (): Promise<NeonDiagnosticResult> => {
    const databaseUrl = process.env["DATABASE_URL"];
    const hostname = getHostname(databaseUrl);

    const result: NeonDiagnosticResult = {
      databaseUrlDefined: Boolean(databaseUrl),
      hostname,
      clientInitialized: false,
      querySucceeded: false,
      serverTime: null,
      error: null,
    };

    if (!databaseUrl) {
      result.error = {
        name: "MissingEnvironmentVariable",
        message: "DATABASE_URL is not defined on the server.",
      };
      return result;
    }

    try {
      const sql = neon(databaseUrl);
      result.clientInitialized = true;

      const rows = await sql`
        select now()::text as server_time
      `;
      const [row] = rows as NeonDiagnosticRow[];

      result.querySucceeded = Boolean(row?.server_time);
      result.serverTime = row?.server_time ?? null;

      if (!result.querySucceeded) {
        result.error = {
          name: "EmptyQueryResult",
          message: "The Neon diagnostic query returned no server_time.",
        };
      }
    } catch (error) {
      result.error = sanitizeError(error);
    }

    return result;
  },
);

function getHostname(databaseUrl: string | undefined): string | null {
  if (!databaseUrl) return null;

  try {
    return new URL(databaseUrl).hostname || null;
  } catch {
    return null;
  }
}

function sanitizeError(error: unknown): SanitizedError {
  if (error instanceof Error) {
    const code = getErrorCode(error);
    const sanitized: SanitizedError = {
      name: error.name,
      message: sanitizeMessage(error.message),
    };

    if (code) {
      sanitized.code = code;
    }

    return sanitized;
  }

  return {
    name: "UnknownError",
    message: "An unknown error occurred while running the Neon diagnostic.",
  };
}

function getErrorCode(error: Error): string | undefined {
  const code = (error as Error & { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

function sanitizeMessage(message: string): string {
  return message.replaceAll(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-database-url]");
}
