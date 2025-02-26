import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const textVariants = cva([], {
  variants: {
    variant: {
      h1: [
        "text-5xl",
        "font-bold",
        "dark:text-text-200",
        "text-text-800",
        "font-heading",
        "leading-tight",
        "tracking-normal",
      ],
      h2: [
        "text-4xl",
        "font-bold",
        "dark:text-text-200",
        "text-text-800",
        "font-heading",
        "leading-tight",
        "tracking-normal",
      ],
      h3: [
        "text-3xl",
        "font-semibold",
        "dark:text-text-200",
        "text-text-800",
        "font-heading",
        "leading-tight",
        "tracking-normal",
      ],
      body: [
        "text-base",
        "font-normal",
        "dark:text-text-200",
        "text-text-800",
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
    variant: "body",
    alignment: "left",
  },
});

type TextVariants = NonNullableProps<typeof textVariants>;

type Props = JSX.IntrinsicElements["div"] & TextVariants;

/**
 * Text component for consistent typography with predefined styles
 *
 * Features:
 * - Multiple variants (h1, h2, h3, body, error)
 * - Consistent styling with proper dark mode support
 * - Text alignment options
 * - Automatically uses semantic HTML tags based on variant
 *
 * @example
 * <Text variant="h1" alignment="center">
 *   Page Title
 * </Text>
 *
 * <Text variant="body">
 *   Regular paragraph text with consistent styling.
 * </Text>
 *
 * <Text variant="error">
 *   Error message with appropriate styling.
 * </Text>
 */
export const Text: FC<Props> = (
  { variant, className, alignment = "left", children, ...rest }: Props,
) => {
  const Tag = variant?.startsWith("h") ? variant : "p";
  return (
    <Tag
      {...rest}
      className={cn(textVariants({ variant, alignment }), className)}
    >
      {children}
    </Tag>
  );
};
