import { cn } from "@/utils/tailwind.ts";
import type { NonNullableProps } from "@/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const infoVariants = cva([
  "rounded-lg",
  "p-4",
  "flex",
  "gap-3",
  "items-center",
], {
  variants: {
    variant: {
      info: [
        "bg-info-50",
        "text-info-800",
        "dark:bg-info-950",
        "dark:text-info-200",
      ],
      warning: [
        "bg-warning-50",
        "text-warning-800",
        "dark:bg-warning-950",
        "dark:text-warning-200",
      ],
      success: [
        "bg-success-50",
        "text-success-800",
        "dark:bg-success-950",
        "dark:text-success-200",
      ],
      danger: [
        "bg-danger-50",
        "text-danger-800",
        "dark:bg-danger-950",
        "dark:text-danger-200",
      ],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type InfoVariants = NonNullableProps<typeof infoVariants>;
type Props = JSX.IntrinsicElements["div"] & InfoVariants;

export const Info: FC<Props> = (
  { className, variant, children, ...props }: Props,
) => {
  return (
    <div
      role="alert"
      className={cn(infoVariants({ variant }), className)}
      {...props}
    >
      <div className="shrink-0 flex items-center">
        {variant === "info" && (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
        {variant === "warning" && (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 3l9 16H3L12 3z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
        {variant === "success" && (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 12l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        {variant === "danger" && (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 9l-6 6M9 9l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
