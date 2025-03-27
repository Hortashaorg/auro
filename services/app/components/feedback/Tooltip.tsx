import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

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
        "bg-surface-dark",
        "text-on-surface-dark-strong",
        "dark:bg-surface-dark-alt",
        "dark:text-on-surface-dark-strong",
      ],
      light: [
        "bg-surface-alt",
        "text-on-surface-strong",
        "dark:bg-surface-alt",
        "dark:text-on-surface-strong",
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

/**
 * Tooltip component for displaying additional information on hover
 *
 * @props
 * - content: Text to show in the tooltip
 * - variant: Visual style of the tooltip ('dark', 'light')
 * - position: Where the tooltip appears relative to the trigger element ('top', 'bottom', 'left', 'right')
 *
 * @example
 * <Tooltip content="This is a helpful tooltip">
 *   <Button>Hover Me</Button>
 * </Tooltip>
 *
 * @example
 * <Tooltip
 *   content="More information"
 *   position="right"
 *   variant="light"
 * >
 *   <Icon name="info" />
 * </Tooltip>
 */
type TooltipProps = BaseComponentProps & TooltipVariants & {
  content: string;
};

export const Tooltip: FC<TooltipProps> = ({
  className,
  variant,
  position,
  content,
  children,
  ...props
}: TooltipProps) => {
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
