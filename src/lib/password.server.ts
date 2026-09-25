import "@tanstack/react-start/server-only";

const encoder = new TextEncoder();
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

function getCrypto(): Crypto {
  return globalThis.crypto;
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const material = await getCrypto().subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await getCrypto().subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = getCrypto().getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(password, salt, ITERATIONS);
  return `pbkdf2:${ITERATIONS}:${toBase64(salt)}:${toBase64(key)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, saltValue, keyValue] = stored.split(":");
  if (scheme !== "pbkdf2" || !iterations || !saltValue || !keyValue) return false;
  const salt = fromBase64(saltValue);
  const expected = fromBase64(keyValue);
  const actual = await deriveKey(password, salt, Number(iterations));
  return timingSafeEqual(actual, expected);
}
