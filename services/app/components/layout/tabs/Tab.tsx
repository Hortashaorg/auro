import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TabProps = JSX.IntrinsicElements["div"] & {
  tabId: string;
};

/**
 * Tab component that contains the content for each tab
 *
 * Features:
 * - Shows/hides content based on active tab
 * - Uses x-cloak to prevent flash of content
 * - Works within the Tabs component context
 * - Styling designed to complement TabsList appearance
 * - Built-in padding and spacing for content focus
 *
 * @example
 * <Tab tabId="account">
 *   <h3 className="text-xl font-bold mb-6">Account Settings</h3>
 *   <div className="space-y-4">
 *     <p>Account content here...</p>
 *   </div>
 * </Tab>
 */
export const Tab: FC<TabProps> = ({
  children,
  tabId,
  className,
  ...props
}: TabProps) => {
  return (
    <div
      id={tabId}
      className={cn(
        "p-6 rounded-lg",
        "bg-white dark:bg-background-900/95 dark:text-white",
        "border border-background-200 dark:border-background-800",
        "animate-fadeIn",
        className,
      )}
      x-show={`activeTab === '${tabId}'`}
      x-cloak
      {...props}
    >
      {children}
    </div>
  );
};
