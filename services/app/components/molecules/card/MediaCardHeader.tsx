import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { Image } from "@comp/atoms/image/Image.tsx";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";

type CardHeaderProps = BaseComponentProps & {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * MediaCardHeader component for displaying a header with an image, title, and optional description
 *
 * @props
 * - title: The title text to display
 * - description: Optional description text to display below the title
 * - imageSrc: Optional image source URL
 * - imageAlt: Alternative text for the image (required if imageSrc is provided)
 * - padding: Internal padding ('none', 'sm', 'md', 'lg')
 *
 * @example
 * <MediaCardHeader
 *   title="Card Title"
 *   description="Optional description"
 *   imageSrc="/path/to/image.jpg"
 *   imageAlt="Image description"
 * />
 */
export const MediaCardHeader: FC<CardHeaderProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  className,
  ...props
}: CardHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-4 mb-2",
        className,
      )}
      {...props}
    >
      {imageSrc && imageAlt && <Image src={imageSrc} alt={imageAlt} />}
      <div className="flex flex-col">
        <Title className="line-clamp-1">
          {title}
        </Title>
        {description && (
          <Text variant="body" className="line-clamp-2">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};
