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
        "px-4 py-2 text-sm font-medium rounded-md transition-all",
        "focus:outline-none focus:ring-1 focus:ring-background-300 dark:focus:ring-background-600",
        "text-text-600 hover:text-text-900 dark:text-background-300 dark:hover:text-text-50 hover:bg-background-50 dark:hover:bg-background-700",
        className,
      )}
      x-bind:class={`activeTab === '${tabId}' 
        ? 'bg-background-50 dark:bg-background-700 dark:text-text-50 shadow-sm' 
        : ''`}
      x-on:click={`activeTab = '${tabId}'`}
      x-trigger
      {...props}
    >
      {children}
    </button>
  );
};
