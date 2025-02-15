import { cn } from "@/utils/tailwind.ts";
import type { NonNullableProps } from "@/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

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
        "text-danger-600",
        "dark:text-danger-400",
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
    variant: "paragraph",
    alignment: "left",
  },
});
type TextVariants = NonNullableProps<typeof textVariants>;

type Props = JSX.IntrinsicElements["div"] & TextVariants;

export const Text: FC<Props> = (
  { variant, className, alignment = "left", children, ...rest }: Props,
) => {
  const Tag = variant === "header" ? "h1" : "p";
  return (
    <Tag
      {...rest}
      className={cn(textVariants({ variant, alignment }), className)}
    >
      {children}
    </Tag>
  );
};
