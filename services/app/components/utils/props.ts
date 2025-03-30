import type { Child } from "@kalena/framework";

export type BaseComponentProps = {
  className?: string;
  id?: string;
  children?: Child;
  "hx-get"?: string;
  "hx-post"?: string;
  "hx-put"?: string;
  "hx-delete"?: string;
  "hx-patch"?: string;
  "hx-swap"?: string;
  "hx-target"?: string;
  "hx-trigger"?: string;
  "hx-indicator"?: string;
  [key: string]: unknown;
};
