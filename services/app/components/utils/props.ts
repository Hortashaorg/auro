export type BaseComponentProps = {
  className?: string;
  id?: string;
  [key: string]: unknown;
};

export type HTMXProps = {
  "hx-get"?: string;
  "hx-post"?: string;
  "hx-put"?: string;
  "hx-delete"?: string;
  "hx-patch"?: string;
  "hx-swap"?: string;
  "hx-target"?: string;
  "hx-trigger"?: string;
  "hx-indicator"?: string;
  "hx-confirm"?: string;
};
