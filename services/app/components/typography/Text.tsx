import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";

const textVariants = cva([], {
  variants: {
    variant: {
      h1: [
        "text-3xl",
        "font-bold",
        "dark:text-on-surface-dark-strong",
        "text-on-surface-strong",
        "leading-tight",
        "tracking-normal",
      ],
      h2: [
        "text-2xl",
        "font-bold",
        "dark:text-on-surface-dark-strong",
        "text-on-surface-strong",
        "leading-tight",
        "tracking-normal",
      ],
      h3: [
        "text-lg",
        "font-semibold",
        "dark:text-on-surface-dark-strong",
        "text-on-surface-strong",
        "leading-tight",
        "tracking-normal",
      ],
      body: [
        "text-base",
        "font-normal",
        "dark:text-on-surface-dark",
        "text-on-surface",
        "font-body",
        "leading-normal",
      ],
      span: [
        "text-base",
        "font-normal",
        "dark:text-on-surface-dark",
        "text-on-surface",
        "font-body",
        "leading-loose",
      ],
      error: [
        "text-base",
        "font-normal",
        "text-danger",
        "dark:text-danger",
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
type TextProps = BaseComponentProps & TextVariants;

/**
 * Text component for consistent typography with predefined styles
 *
 * @props
 * - variant: Typography style (h1, h2, h3, body, span, error)
 * - alignment: Text alignment (left, center)
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
export const Text: FC<TextProps> = (
  { variant, className, alignment = "left", children, ...rest }: TextProps,
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
