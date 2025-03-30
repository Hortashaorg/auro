import type { FC } from "@kalena/framework";
import { cn } from "@comp/utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { Icon } from "@comp/atoms/typography/index.ts";

/**
 * ToastNotifications component for managing and displaying toast notifications
 *
 * @example
 * <ToastNotifications />
 */
export const ToastNotifications: FC = () => {
  const props: Record<string, string> = {};
  props["x-on:show-toast.window"] = `addNotification({
                variant: $event.detail.variant,
                title: $event.detail.title,
                message: $event.detail.message,
            })`;
  props["x-data"] = `{
            notifications: [],
            displayDuration: 8000,
            soundEffect: false,
    
            addNotification({ variant = 'info', sender = null, title = null, message = null}) {
                const id = Date.now()
                const notification = { id, variant, sender, title, message }
    
                // Keep only the most recent 20 notifications
                if (this.notifications.length >= 20) {
                    this.notifications.splice(0, this.notifications.length - 19)
                }
    
                // Add the new notification to the notifications stack
                this.notifications.push(notification)
            },
            removeNotification(id) {
                setTimeout(() => {
                    this.notifications = this.notifications.filter(
                        (notification) => notification.id !== id,
                    )
                }, 400);
            },
        }`;

  return (
    <div
      {...props}
    >
      <div
        x-on:mouseenter="$dispatch('pause-auto-dismiss')"
        x-on:mouseleave="$dispatch('resume-auto-dismiss')"
        className="group pointer-events-none fixed inset-x-8 top-0 z-99 flex max-w-full flex-col gap-2 bg-transparent px-6 py-6 md:bottom-0 md:left-[unset] md:right-0 md:top-[unset] md:max-w-sm"
      >
        <template
          x-for="(notification, index) in notifications"
          x-bind:key="notification.id"
        >
          <div>
            <template x-if="notification.variant === 'info'">
              <NotificationContent variant="info" />
            </template>
            <template x-if="notification.variant === 'warning'">
              <NotificationContent variant="warning" />
            </template>
            <template x-if="notification.variant === 'success'">
              <NotificationContent variant="success" />
            </template>
            <template x-if="notification.variant === 'danger'">
              <NotificationContent variant="danger" />
            </template>
          </div>
        </template>
      </div>
    </div>
  );
};

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

type NotificationVariants = NonNullableProps<
  typeof notificationVariants,
  "variant"
>;
type NotificationContentProps = NotificationVariants;

const NotificationContent: FC<NotificationContentProps> = ({
  variant,
}: NotificationContentProps) => {
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
        <Icon icon={variant} variant={variant} />

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
        <button
          type="button"
          className="ml-auto cursor-pointer"
          aria-label="dismiss notification"
          x-on:click="(isVisible = false), removeNotification(notification.id)"
        >
          <Icon icon="cross" />
        </button>
      </div>
    </div>
  );
};
