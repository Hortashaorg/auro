import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import { Icon } from "@comp/atoms/typography/index.ts";

const alertVariants = cva([
  "pointer-events-auto",
  "relative",
  "rounded-radius",
  "border",
  "bg-surface",
  "text-on-surface",
  "dark:bg-surface-dark",
  "dark:text-on-surface-dark",
], {
  variants: {
    variant: {
      info: [
        "border-info",
      ],
      warning: [
        "border-warning",
      ],
      success: [
        "border-success",
      ],
      danger: [
        "border-danger",
      ],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const contentVariants = cva([
  "flex",
  "w-full",
  "items-center",
  "gap-2.5",
  "rounded-radius",
  "p-4",
  "transition-all",
  "duration-300",
], {
  variants: {
    variant: {
      info: ["bg-info/10"],
      warning: ["bg-warning/10"],
      success: ["bg-success/10"],
      danger: ["bg-danger/10"],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type AlertVariants = NonNullableProps<typeof alertVariants, "variant">;
type AlertProps = BaseComponentProps & AlertVariants & {
  onDismiss?: string;
};

/**
 * Alert component for displaying contextual messages and alerts
 *
 * @props
 * - variant: Alert style (info, warning, success, danger)
 * - title: Title of the alert
 *
 * @example
 * <Alert variant="info" title="Information">
 *   This is an informational message.
 * </Alert>
 */
export const Alert: FC<AlertProps> = (
  { className, variant, children, onDismiss, ...props }: AlertProps,
) => {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className={cn(contentVariants({ variant }))}>
        <Icon icon={variant} variant={variant} size="size-7" />
        <div className="flex flex-col gap-2">
          {children}
        </div>
        {onDismiss && (
          <button
            type="button"
            x-on:click={onDismiss}
            className="ml-auto cursor-pointer"
            aria-label="Dismiss alert"
          >
            <Icon icon="x" variant="default" />
          </button>
        )}
      </div>
    </div>
  );
};
