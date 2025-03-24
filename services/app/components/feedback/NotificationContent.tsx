import type { FC, JSX } from "@kalena/framework";
import { cn } from "@comp/utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const notificationVariants = cva([
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

const iconContainerVariants = cva([
  "rounded-full",
  "p-0.5",
], {
  variants: {
    variant: {
      info: ["bg-info/15", "text-info"],
      warning: ["bg-warning/15", "text-warning"],
      success: ["bg-success/15", "text-success"],
      danger: ["bg-danger/15", "text-danger"],
      message: [""],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const titleVariants = cva([
  "text-sm",
  "font-semibold",
], {
  variants: {
    variant: {
      info: ["text-info"],
      warning: ["text-warning"],
      success: ["text-success"],
      danger: ["text-danger"],
      message: [
        "text-on-surface-strong",
        "dark:text-on-surface-dark-strong",
      ],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type NotificationVariants = NonNullableProps<typeof notificationVariants>;
type Props =
  & JSX.IntrinsicElements["div"]
  & NotificationVariants
  & {
    title?: string;
    message?: string;
    sender?: {
      name: string;
      avatar: string;
    };
  };

export const NotificationContent: FC<Props> = ({
  variant,
}) => {
  const notifications = {
    ["x-on:pause-auto-dismiss.window"]: `clearTimeout(timeout)`,
    ["x-on:resume-auto-dismiss.window"]:
      `timeout = setTimeout(() => {(isVisible = false), removeNotification(notification.id) }, displayDuration)`,
    ["x-data"]: `{ isVisible: false, timeout: null }`,
    ["x-show"]: "isVisible",
    ["x-init"]:
      "$nextTick(() => { isVisible = true }), (timeout = setTimeout(() => { isVisible = false, removeNotification(notification.id)}, displayDuration))",
    ["x-transition:enter"]: "transition duration-300 ease-out",
    ["x-transition:enter-end"]: "translate-y-0",
    ["x-transition:enter-start"]: "translate-y-8",
    ["x-transition:leave"]: "transition duration-300 ease-in",
    ["x-transition:leave-end"]: "-translate-x-24 opacity-0 md:translate-x-24",
    ["x-transition:leave-start"]: "translate-x-0 opacity-100",
  };

  return (
    <div
      x-cloak
      className={cn(notificationVariants({ variant }))}
      role="alert"
      {...notifications}
    >
      <div className={cn(contentVariants({ variant }))}>
        <div className={cn(iconContainerVariants({ variant }))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h3
            x-cloak
            x-show="notification.title"
            className={cn(titleVariants({ variant }))}
            x-text="notification.title"
          >
          </h3>
          <p
            x-cloak
            x-show="notification.message"
            className="text-pretty text-sm"
            x-text="notification.message"
          >
          </p>
        </div>
      </div>
    </div>
  );
};
