import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TabsTriggerProps = JSX.IntrinsicElements["button"] & {
  tabId: string;
};

/**
 * TabsTrigger component that serves as the clickable tab button
 *
 * Features:
 * - Handles tab selection via AlpineJS
 * - Applies active/inactive styling with clear visual distinction
 * - Accessible button element
 * - Supports auto-initialization of first tab
 * - Styling coordinates with Tab content panel
 *
 * @example
 * <TabsTrigger tabId="account">Account</TabsTrigger>
 */
export const TabsTrigger: FC<TabsTriggerProps> = ({
  children,
  tabId,
  className,
  ...props
}: TabsTriggerProps) => {
  return (
    <button
      type="button"
      className={cn(
        "text-on-surface font-medium dark:text-on-surface-dark dark:hover:border-b-outline-dark-strong dark:hover:text-on-surface-dark-strong hover:border-b-2 hover:border-b-outline-strong hover:text-on-surface-strong px-2 py-4",
        className,
      )}
      x-bind:class={`activeTab === '${tabId}' 
        ? 'font-bold text-on-surface-strong border-b-2 border-primary dark:border-primary-dark dark:text-on-surface-dark-strong' 
        : ''`}
      x-on:click={`activeTab = '${tabId}'`}
      x-trigger
      {...props}
    >
      {children}
    </button>
  );
};
