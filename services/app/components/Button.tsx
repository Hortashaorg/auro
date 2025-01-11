import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { JSX } from "preact";

const buttonVariants = cva(["bg-primary-50", "hover:bg-primary-100"], {
  variants: {
    variant: {
      primary: ["text-text-700", "font-bold", "py-2", "px-4", "rounded"],
      secondary: ["text-text-700", "font-normal", "py-2", "px-4", "rounded"],
    },
    defaultVariants: {
      variant: "primary",
    },
  },
});

type ButtonVariants = NonNullableProps<typeof buttonVariants>;

interface Props extends JSX.HTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export const Button = ({ children, variant, ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={buttonVariants({ variant })}
    >
      {children}
    </button>
  );
};
