import { crypto } from "jsr:@std/crypto";
import { encodeHex } from "jsr:@std/encoding/hex";

export const throwError = (message: string): never => {
  throw new Error(message);
};

export const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  const buffer = await crypto.subtle.digest("SHA-256", data);
  return encodeHex(buffer);
};
