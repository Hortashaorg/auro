import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps, HTMXProps } from "@comp/utils/props.ts";
import { cn } from "@comp/utils/tailwind.ts";

const iconButtonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-primary",
    "disabled:opacity-75",
    "disabled:cursor-not-allowed",
    "cursor-pointer",
  ],
  {
    variants: {
      background: {
        none: [],
        surfaceAlt: [
          "bg-surface-alt",
          "dark:bg-surface-dark-alt",
        ],
        surface: [
          "bg-surface",
          "dark:bg-surface-dark",
        ],
      },
      backgroundHover: {
        none: [],
        surfaceAlt: [
          "hover:bg-surface-alt",
          "dark:hover:bg-surface-dark-alt",
        ],
        surface: [
          "hover:bg-surface",
          "dark:hover:bg-surface-dark",
        ],
      },
      text: {
        normal: [
          "text-on-surface",
          "dark:text-on-surface-dark",
        ],
      },
      buttonSize: {
        sm: ["p-1"],
        md: ["p-2"],
        lg: ["p-3"],
      },
    },
    defaultVariants: {
      background: "surfaceAlt",
      backgroundHover: "surface",
      text: "normal",
      buttonSize: "md",
    },
  },
);

type IconButtonVariantProps = VariantProps<typeof iconButtonVariants>;
type IconButtonProps =
  & BaseComponentProps
  & IconButtonVariantProps
  & HTMXProps
  & {
    "aria-label": string;
  };

export const IconButton: FC<IconButtonProps> = ({
  background,
  backgroundHover,
  text,
  buttonSize,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        iconButtonVariants({ background, backgroundHover, text, buttonSize }),
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
