import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TabsListProps = JSX.IntrinsicElements["div"];

/**
 * TabsList component that contains the tab triggers
 *
 * Features:
 * - Flexible container for tab triggers
 * - Can be styled with custom classes
 * - Works within the Tabs component context
 * - Styling coordinates with Tab content panel
 * - Enhanced padding for better spacing
 *
 * @example
 * <TabsList className="grid w-full grid-cols-2">
 *   <TabsTrigger tabId="account">Account</TabsTrigger>
 *   <TabsTrigger tabId="password">Password</TabsTrigger>
 * </TabsList>
 */
export const TabsList: FC<TabsListProps> = ({
  children,
  className,
  ...props
}: TabsListProps) => {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto border-b border-outline dark:border-outline-dark",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
