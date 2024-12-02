import type { ClassValue } from "@nick/clsx";
import { twMerge } from "tailwind-merge";
import { clsx } from "@nick/clsx";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
