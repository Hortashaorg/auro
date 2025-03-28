import type { FC } from "@kalena/framework";

type ImageProps = {
  src: string;
  alt: string;
};

/**
 * Basic Image component for displaying images.
 *
 * @props
 * - src: Image source URL
 * - alt: Alternative text description
 *
 * @example
 * <Image src="/path/to/image.jpg" alt="Descriptive text" />
 */
export const Image: FC<ImageProps> = ({
  src,
  alt,
  ...props
}: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      {...props}
    />
  );
};
