import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableBodyProps = JSX.IntrinsicElements["tbody"] & {
  loading?: boolean;
  emptyText?: string;
  isEmpty?: boolean;
  colSpan?: number;
};

/**
 * TableBody component for the main content area of tables
 *
 * Features:
 * - Loading state support with Alpine.js binding
 * - Empty state handling
 * - Customizable empty state message
 *
 * @example
 * <TableBody isEmpty={items.length === 0} emptyText="No items found" colSpan={3}>
 *   {items.map(item => (
 *     <TableRow key={item.id}>
 *       <TableCell>{item.name}</TableCell>
 *     </TableRow>
 *   ))}
 * </TableBody>
 */
export const TableBody: FC<TableBodyProps> = ({
  children,
  className,
  loading = false,
  isEmpty = false,
  emptyText = "No data available",
  colSpan = 1,
  ...props
}: TableBodyProps) => {
  return (
    <tbody
      className={cn(
        loading && "opacity-50",
        className,
      )}
      {...props}
    >
      {isEmpty
        ? (
          <tr>
            <td
              colSpan={colSpan}
              className="px-4 py-4 text-center text-text-500 dark:text-text-400"
            >
              {emptyText}
            </td>
          </tr>
        )
        : children}
    </tbody>
  );
};
