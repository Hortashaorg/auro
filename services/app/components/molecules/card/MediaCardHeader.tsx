import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { Text } from "@comp/typography/Text.tsx";
import { Image } from "@comp/atoms/image/Image.tsx";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const cardHeaderVariants = cva([
  "flex",
  "items-center",
  "gap-4",
], {
  variants: {
    padding: {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

type CardHeaderVariants = NonNullableProps<typeof cardHeaderVariants>;
type CardHeaderProps = BaseComponentProps & CardHeaderVariants & {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * MediaCardHeader component for displaying a header with an image, title, and optional subtitle
 *
 * @props
 * - title: The title text to display
 * - subtitle: Optional subtitle text to display below the title
 * - imageSrc: Optional image source URL
 * - imageAlt: Alternative text for the image (required if imageSrc is provided)
 * - padding: Internal padding ('none', 'sm', 'md', 'lg')
 *
 * @example
 * <MediaCardHeader
 *   title="Card Title"
 *   subtitle="Optional subtitle"
 *   imageSrc="/path/to/image.jpg"
 *   imageAlt="Image description"
 * />
 */
export const MediaCardHeader: FC<CardHeaderProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  className,
  padding,
  ...props
}: CardHeaderProps) => {
  return (
    <div
      className={cn(
        cardHeaderVariants({ padding }),
        className,
      )}
      {...props}
    >
      {imageSrc && imageAlt && (
        <div className="flex-shrink-0">
          <Image src={imageSrc} alt={imageAlt} />
        </div>
      )}
      <div className="flex flex-col">
        <Text variant="h3">{title}</Text>
        {subtitle && (
          <Text variant="body">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
};
