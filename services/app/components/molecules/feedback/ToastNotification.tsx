import type { FC } from "@kalena/framework";
import { Alert } from "@comp/molecules/feedback/Alert.tsx";
import { AlertTitle } from "@comp/atoms/feedback/index.ts";

/**
 * ToastNotifications component for managing and displaying toast notifications
 *
 * @example
 * <ToastNotifications />
 */
export const ToastNotifications: FC = () => {
  const props: Record<string, string> = {};
  props["x-on:toast-show.window"] = `addNotification({
                variant: $event.detail.variant,
                title: $event.detail.title,
                message: $event.detail.message,
            })`;
  props["x-data"] = `{
            notifications: [],
            displayDuration: 3000,
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

type NotificationContentProps = {
  variant: "info" | "warning" | "success" | "danger";
};

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
    <Alert
      {...notifications}
      variant={variant}
      onDismiss="(isVisible = false), removeNotification(notification.id)"
    >
      <AlertTitle variant={variant}>
        <span x-text="notification.title"></span>
      </AlertTitle>
      <span x-text="notification.message"></span>
    </Alert>
  );
};
