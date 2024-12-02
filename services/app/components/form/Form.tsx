import { cva } from "class-variance-authority";
import type { JSX } from "preact";
import type { NonNullableProps } from "@utils/types.ts";
import { cn } from "@utils/tailwind.ts";

const formVariants = cva(["flex", "flex-col", "gap-5", "grow"], {
  variants: {
    alignment: {
      left: [],
      center: ["m-auto"],
    },
  },
  defaultVariants: {
    alignment: "left",
  },
});

type FormVariants = NonNullableProps<typeof formVariants, "alignment">;

interface Props extends JSX.HTMLAttributes<HTMLFormElement>, FormVariants {}

export const Form = ({ className, alignment, ...rest }: Props) => {
  return (
    <form
      {...rest}
      className={cn(
        formVariants({ alignment }),
        className,
      )}
    >
    </form>
  );
};
