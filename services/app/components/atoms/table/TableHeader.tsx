import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type TableHeaderProps = BaseComponentProps;

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
        "border-b border-outline text-sm text-on-surface-strong dark:border-outline-dark dark:text-on-surface-dark-strong",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};
