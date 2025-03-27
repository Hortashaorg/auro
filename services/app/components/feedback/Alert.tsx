import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";

const alertVariants = cva([
  "rounded-lg",
  "p-4",
  "flex",
  "gap-2",
  "items-center",
  "border",
  "w-full",
  "overflow-hidden",
], {
  variants: {
    variant: {
      info: [
        "border-info",
        "bg-info/10",
        "text-on-surface",
        "dark:bg-info/50",
        "dark:text-on-surface-dark",
      ],
      warning: [
        "border-warning",
        "bg-warning/10",
        "text-on-surface",
        "dark:bg-warning/25",
        "dark:text-on-surface-dark",
      ],
      success: [
        "border-success",
        "bg-success/10",
        "text-on-surface",
        "dark:bg-success/50",
        "dark:text-on-surface-dark",
      ],
      danger: [
        "border-danger",
        "bg-danger/10",
        "text-on-surface",
        "dark:bg-danger/50",
        "dark:text-on-surface-dark",
      ],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const textVariants = cva([], {
  variants: {
    variant: {
      info: ["text-info"],
      warning: ["text-warning"],
      success: ["text-success"],
      danger: ["text-danger"],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type AlertVariants = NonNullableProps<typeof alertVariants>;

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
type AlertProps = BaseComponentProps & AlertVariants & {
  title: string;
};

export const Alert: FC<AlertProps> = (
  { className, variant, children, title, ...props }: AlertProps,
) => {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className={cn(textVariants({ variant }))}>
        {variant === "info" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-6"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
        {variant === "warning" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-6"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
        {variant === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-6"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
        {variant === "danger" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-6"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
      </div>
      <div className="ml-2">
        <h3
          className={cn(textVariants({ variant }), "text-lg font-semibold")}
        >
          {title}
        </h3>
        <p className="text-xs font-medium sm:text-sm">{children}</p>
      </div>
    </div>
  );
};
