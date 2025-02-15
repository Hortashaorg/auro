import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const imgVariants = cva([
  "max-w-full",
  "h-auto",
], {
  variants: {
    fit: {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      none: "object-none",
      scaleDown: "object-scale-down",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    fit: "cover",
    rounded: "none",
  },
});

type ImgVariants = NonNullableProps<typeof imgVariants>;
type Props = JSX.IntrinsicElements["img"] & ImgVariants;

export const Img: FC<Props> = ({
  className,
  fit,
  rounded,
  alt = "",
  ...props
}: Props) => {
  return (
    <img
      className={cn(imgVariants({ fit, rounded }), className)}
      alt={alt}
      {...props}
    />
  );
};
