import { cva } from "class-variance-authority";
import { JSX } from "preact";
import type { NonNullableProps } from "@utils/types.ts";
import { cn } from "@utils/tailwind.ts";

const textVariants = cva([], {
  variants: {
    variant: {
      header: [
        "text-5xl",
        "font-bold",
        "dark:text-text-200",
        "text-text-700",
        "font-heading",
        "leading-tight",
        "tracking-normal",
      ],
      paragraph: [
        "text-base",
        "font-normal",
        "dark:text-text-200",
        "text-text-700",
        "font-body",
        "leading-loose",
      ],
      error: [
        "text-base",
        "font-normal",
        "text-error-600",
        "dark:text-error-400",
        "font-body",
        "leading-loose",
      ],
    },
    alignment: {
      left: ["text-left"],
      center: ["text-center"],
    },
  },
  defaultVariants: {
    alignment: "left",
  },
});
type TextVariants = NonNullableProps<typeof textVariants, "variant">;

interface Props extends JSX.HTMLAttributes<HTMLDivElement>, TextVariants {}

export const Text = (
  { variant, className, alignment = "left", ...rest }: Props,
) => {
  const Tag = variant === "header" ? "h1" : "p";
  return (
    <Tag
      {...rest}
      className={cn(textVariants({ variant, alignment }), className)}
    >
    </Tag>
  );
};
