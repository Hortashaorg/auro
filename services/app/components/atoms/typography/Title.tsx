import { cn } from "@comp/utils/tailwind.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "@kalena/framework";

const titleVariants = cva([], {
  variants: {
    level: {
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
    },
    alignment: {
      left: ["text-left"],
      center: ["text-center"],
    },
  },
  defaultVariants: {
    level: "h3",
    alignment: "left",
  },
});

type TitleVariantProps = VariantProps<typeof titleVariants>;

type Props =
  & BaseComponentProps
  & TitleVariantProps;

/**
 * Title component for rendering semantic headings (h1-h3)
 * with consistent typography styles based on the level.
 *
 * @props
 * - level: Semantic heading level ('h1', 'h2', 'h3'). Required. Determines tag and styling.
 * - alignment: Text alignment ('left', 'center'). Defaults to 'left'.
 * - children: The text content of the title.
 * - className: Additional CSS classes.
 * - ...rest: Standard HTML heading attributes (e.g., id).
 *
 * @example // Renders <h1> with h1 styles
 * <Title level="h1">Main Page Title</Title>
 *
 * @example // Renders <h2> with h2 styles, centered
 * <Title level="h2" alignment="center">Section Title</Title>
 *
 * @example // Renders <h3> with h3 styles
 * <Title level="h3">Subsection Title</Title>
 */
export const Title: FC<Props> = ({
  className,
  level,
  alignment,
  children,
  ...rest
}: Props) => {
  const Tag = level ?? "h3";

  return (
    <Tag
      {...rest}
      className={cn(
        titleVariants({ level, alignment }),
        className,
      )}
    >
      {children}
    </Tag>
  );
};
