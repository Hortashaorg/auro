import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const buttonLinkVariants = cva([
  "whitespace-nowrap",
  "rounded-radius",
  "border",
  "font-medium",
  "tracking-wide",
  "transition",
  "hover:opacity-75",
  "text-center",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "active:opacity-100",
  "active:outline-offset-0",
  "disabled:opacity-75",
  "disabled:cursor-not-allowed",
], {
  variants: {
    variant: {
      primary: [
        "bg-primary",
        "border-primary",
        "text-on-primary",
        "focus-visible:outline-primary",
        "dark:bg-primary-dark",
        "dark:border-primary-dark",
        "dark:text-on-primary-dark",
        "dark:focus-visible:outline-primary-dark",
      ],
      secondary: [
        "bg-secondary",
        "border-secondary",
        "text-on-secondary",
        "focus-visible:outline-primary",
        "dark:bg-secondary-dark",
        "dark:border-secondary-dark",
        "dark:text-on-secondary-dark",
        "dark:focus-visible:outline-secondary-dark",
      ],
      outline: [
        "bg-transparent",
        "border-outline",
        "text-on-surface-strong",
        "hover:bg-surface-alt/50",
        "dark:border-outline-dark",
        "dark:text-on-surface-dark-strong",
        "dark:hover:bg-surface-dark-alt/50",
      ],
    },
    buttonSize: {
      sm: ["text-xs", "px-2", "py-1"],
      md: ["text-sm", "px-4", "py-2"],
      lg: ["text-base", "px-4", "py-2"],
    },
  },
  defaultVariants: {
    variant: "primary",
    buttonSize: "md",
  },
});

type ButtonLinkVariants = NonNullableProps<typeof buttonLinkVariants>;
type ButtonLinkProps = BaseComponentProps & ButtonLinkVariants & {
  href: string;
};

/**
 * ButtonLink component for link styling that looks like a button
 *
 * @props
 * - href: Link destination URL
 * - variant: Visual style of the button link ('primary', 'secondary', 'outline')
 * - buttonSize: Size of the button link ('sm', 'md', 'lg')
 *
 * @example
 * <ButtonLink
 *   href="/dashboard"
 *   variant="primary"
 *   buttonSize="md"
 * >
 *   Go to Dashboard
 * </ButtonLink>
 */
export const ButtonLink: FC<ButtonLinkProps> = ({
  children,
  className,
  variant,
  buttonSize,
  ...rest
}: ButtonLinkProps) => {
  return (
    <a
      {...rest}
      role="button"
      className={cn(buttonLinkVariants({ variant, buttonSize }), className)}
    >
      {children}
    </a>
  );
};
