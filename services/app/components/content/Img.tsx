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

/**
 * Image component with consistent styling and object-fit options
 *
 * Features:
 * - Multiple object-fit options (contain, cover, fill, none, scaleDown)
 * - Border radius variants (none, sm, md, lg, full)
 * - Responsive by default (max-width: 100%, height: auto)
 * - Default empty alt text for accessibility
 *
 * @example
 * <Img
 *   src="/path/to/image.jpg"
 *   fit="cover"
 *   rounded="lg"
 *   alt="Description of the image"
 * />
 *
 * <Img
 *   src="/path/to/avatar.jpg"
 *   fit="cover"
 *   rounded="full"
 *   alt="User avatar"
 * />
 */
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
