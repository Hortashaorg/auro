import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const cardImageVariants = cva([
  "object-cover",
  "transition",
  "duration-700",
  "ease-out",
], {
  variants: {
    hover: {
      scale: "group-hover:scale-105",
      none: "",
    },
    objectFit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
    },
    height: {
      auto: "h-auto",
      sm: "h-32",
      md: "h-48",
      lg: "h-64",
      xl: "h-80",
    },
  },
  defaultVariants: {
    hover: "scale",
    objectFit: "cover",
    height: "auto",
  },
});

type CardImageVariants = NonNullableProps<typeof cardImageVariants>;
type CardImageProps = BaseComponentProps & CardImageVariants & {
  src: string;
  alt: string;
};

/**
 * CardImage component for displaying images within Cards
 *
 * @props
 * - src: Image source URL
 * - alt: Alternative text description
 * - hover: Hover effect ('scale', 'none')
 * - objectFit: How the image fits its container ('cover', 'contain', 'fill', 'none')
 * - height: Height of the image ('auto', 'sm', 'md', 'lg', 'xl')
 *
 * @example
 * <CardImage
 *   src="/product.jpg"
 *   alt="Product"
 *   hover="scale"
 *   height="lg"
 * />
 */
export const CardImage: FC<CardImageProps> = ({
  className,
  hover,
  objectFit,
  height,
  ...props
}: CardImageProps) => {
  return (
    <div className="overflow-hidden">
      <img
        {...props}
        className={cn(
          cardImageVariants({ hover, objectFit, height }),
          className,
        )}
      />
    </div>
  );
};
