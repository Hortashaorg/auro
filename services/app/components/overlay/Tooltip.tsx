import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { JSX } from "@package/framework";

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

export const Tooltip = ({
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
