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
        "border-b border-outline bg-primary text-sm text-on-primary dark:border-outline-dark dark:bg-primary-dark dark:text-on-primary-dark",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};
