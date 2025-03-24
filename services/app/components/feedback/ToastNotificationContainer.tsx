import type { FC, JSX } from "@kalena/framework";
import { NotificationContent } from "./NotificationContent.tsx";

type Props = JSX.IntrinsicElements["div"];

export const ToastNotificationContainer: FC<Props> = (
  props,
) => {
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
