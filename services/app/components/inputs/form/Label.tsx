import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const labelVariants = cva([
  "block",
  "text-base",
  "font-normal",
  "dark:text-text-200",
  "text-text-800",
  "font-body",
  "mb-2",
], {
  variants: {
    required: {
      true: ["after:content-['*']", "after:ml-0.5", "after:text-danger-500"],
    },
    size: {
      default: ["text-base"],
      small: ["text-sm"],
      large: ["text-lg"],
    },
  },
  defaultVariants: {
    required: false,
    size: "default",
  },
});

type LabelVariants = NonNullableProps<typeof labelVariants>;
type Props = JSX.IntrinsicElements["label"] & LabelVariants & {
  htmlFor?: string;
};

export const Label: FC<Props> = ({
  className,
  required,
  size,
  children,
  htmlFor,
  ...props
}: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(labelVariants({ required, size }), className)}
      {...props}
    >
      {children}
    </label>
  );
};
