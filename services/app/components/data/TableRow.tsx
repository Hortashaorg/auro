import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableRowProps = JSX.IntrinsicElements["tr"] & {
  isHeader?: boolean;
  zebra?: boolean;
  index?: number;
  hoverable?: boolean;
  active?: boolean;
};

/**
 * TableRow component for rows within tables
 *
 * Features:
 * - Support for zebra striping
 * - Header row styling
 * - Hover state highlighting
 * - Active state styling
 *
 * @example
 * <TableRow zebra index={0} hoverable>
 *   <TableCell>Cell content</TableCell>
 * </TableRow>
 */
export const TableRow: FC<TableRowProps> = ({
  children,
  className,
  isHeader = false,
  zebra = false,
  index = 0,
  hoverable = false,
  active = false,
  ...props
}: TableRowProps) => {
  return (
    <tr
      className={cn(
        isHeader
          ? "border-b border-background-300 dark:border-background-700"
          : "border-b border-background-200 dark:border-background-800",
        zebra && !isHeader && index % 2 === 1 &&
          "bg-background-50 dark:bg-background-800",
        hoverable && "hover:bg-background-100 dark:hover:bg-background-950",
        active && "bg-primary-50 dark:bg-primary-900",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};
