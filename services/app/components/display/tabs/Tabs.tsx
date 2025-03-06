import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TabsProps = JSX.IntrinsicElements["div"] & {
  initialTabId: string;
};

/**
 * Tabs component that serves as the container for the tab system
 *
 * Features:
 * - Client-side tab switching with AlpineJS
 * - Supports initial tab selection
 * - Provides context for child components
 * - Automatically selects first tab if no initialTabId is provided
 *
 * @example
 * <Tabs initialTabId="account">
 *   <TabsList>
 *     <TabsTrigger tabId="account">Account</TabsTrigger>
 *     <TabsTrigger tabId="password">Password</TabsTrigger>
 *   </TabsList>
 *   <Tab tabId="account">Account content</Tab>
 *   <Tab tabId="password">Password content</Tab>
 * </Tabs>
 */
export const Tabs: FC<TabsProps> = ({
  children,
  initialTabId,
  className,
  ...props
}: TabsProps) => {
  return (
    <div
      className={cn(
        "text-on-surface dark:text-on-surface-dark border rounded-sm border-outline dark:border-outline-dark w-full",
        "bg-surface-alt dark:bg-surface-dark-alt",
        className,
      )}
      x-data={`{ 
        activeTab: '${initialTabId}',
      }`}
      {...props}
    >
      {children}
    </div>
  );
};
