import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const tooltipVariants = cva([
  "absolute",
  "z-50",
  "rounded-md",
  "px-2",
  "py-1",
  "text-sm",
  "shadow-md",
  "transition-opacity",
  "duration-200",
], {
  variants: {
    variant: {
      dark: [
        "bg-background-800",
        "text-text-100",
        "dark:bg-background-700",
        "dark:text-text-100",
      ],
      light: [
        "bg-background-100",
        "text-text-800",
        "dark:bg-background-200",
        "dark:text-text-800",
      ],
    },
    position: {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    },
  },
  defaultVariants: {
    variant: "dark",
    position: "top",
  },
});

type TooltipVariants = NonNullableProps<typeof tooltipVariants>;

type Props =
  & JSX.IntrinsicElements["div"]
  & TooltipVariants
  & {
    content: string;
  };

/**
 * Tooltip component for displaying additional information on hover
 *
 * Features:
 * - Multiple variants (dark, light)
 * - Positioning options (top, bottom, left, right)
 * - Smooth transition animations
 * - Alpine.js integration for show/hide behavior
 * - Accessible with proper ARIA role
 *
 * @example
 * <Tooltip
 *   content="This is a helpful tooltip"
 *   position="top"
 *   variant="dark"
 * >
 *   <Button>Hover Me</Button>
 * </Tooltip>
 *
 * <Tooltip
 *   content="More information"
 *   position="right"
 *   variant="light"
 * >
 *   <Icon name="info" />
 * </Tooltip>
 */
export const Tooltip: FC<Props> = ({
  className,
  variant,
  position,
  content,
  children,
  ...props
}: Props) => {
  return (
    <div className="relative inline-block" x-data="{ show: false }">
      <div
        x-on:mouseenter="show = true"
        x-on:mouseleave="show = false"
        x-on:focus="show = true"
        x-on:blur="show = false"
      >
        {children}
      </div>
      <div
        role="tooltip"
        x-show="show"
        x-cloak
        className={cn(
          tooltipVariants({ variant, position }),
          "pointer-events-none",
          className,
        )}
        {...props}
      >
        {content}
      </div>
    </div>
  );
};
