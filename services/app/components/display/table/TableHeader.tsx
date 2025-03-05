import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableHeaderProps = JSX.IntrinsicElements["thead"];

/**
 * TableHeader component for the header section of tables
 *
 * @example
 * <TableHeader>
 *   <TableRow>
 *     <TableCell isHeader>Column 1</TableCell>
 *     <TableCell isHeader>Column 2</TableCell>
 *   </TableRow>
 * </TableHeader>
 */
export const TableHeader: FC<TableHeaderProps> = ({
  children,
  className,
  ...props
}: TableHeaderProps) => {
  return (
    <thead
      className={cn(
        "border-b border-outline bg-surface-alt text-sm text-on-surface-strong dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark-strong",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};
