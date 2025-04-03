import { cn } from "@comp/utils/tailwind.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "@kalena/framework";

const textVariants = cva([], {
  variants: {
    variant: {
      body: [
        "text-base",
        "font-normal",
        "dark:text-on-surface-dark",
        "text-on-surface",
        "font-body",
        "leading-normal",
      ],
      strong: [
        "text-base",
        "font-bold",
        "dark:text-on-surface-dark-strong",
        "text-on-surface-strong",
        "font-medium",
        "leading-normal",
      ],
      error: [
        "text-base",
        "font-normal",
        "text-danger",
        "dark:text-danger",
        "font-body",
        "leading-normal",
      ],
    },
    alignment: {
      left: ["text-left"],
      center: ["text-center"],
    },
    size: {
      sm: ["text-sm"],
      normal: ["text-base"],
    },
  },
  defaultVariants: {
    variant: "body",
    alignment: "left",
    size: "normal",
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

type Props =
  & BaseComponentProps
  & TextVariantProps
  & {
    as?: "span" | "p";
  };

/**
 * Text component for rendering general text elements like paragraphs and spans.
 *
 * Use `variant` for semantic styling (body, strong, error) and `as` to control the HTML tag.
 * For semantic headings (h1-h6), use the dedicated `Title` component.
 *
 * @props
 * - variant: Typographic style ('body', 'strong', 'error'). Defaults to 'body'.
 * - alignment: Text alignment ('left', 'center'). Defaults to 'left'.
 * - size: Text size ('sm', 'normal'). Defaults to 'normal'.
 * - as: Optional HTML tag to render (e.g., 'p', 'span'). Defaults to 'p'.
 * - className: Additional CSS classes.
 * - children: The text content.
 * - ...rest: Other props passed to the underlying HTML element.
 *
 * @example // Body text (renders <p>)
 * <Text>This is a paragraph.</Text>
 *
 * @example // Strong text inline (renders <span>)
 * <Text variant="strong" as="span">Important word.</Text>
 *
 * @example // Error message (renders <p>)
 * <Text variant="error">Something went wrong.</Text>
 *
 * @example // Small text
 * <Text size="sm">This is smaller text.</Text>
 */
export const Text: FC<Props> = (
  { variant, className, alignment, size, as, children, ...rest }: Props,
) => {
  const defaultTag = "p";
  const Tag = as || defaultTag;

  return (
    <Tag
      {...rest}
      className={cn(textVariants({ variant, alignment, size }), className)}
    >
      {children}
    </Tag>
  );
};
