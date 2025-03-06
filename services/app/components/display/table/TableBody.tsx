import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableBodyProps = JSX.IntrinsicElements["tbody"];

/**
 * TableBody component for the main content area of tables
 *
 * Features:
 * - Provides the container for table rows
 * - Styled with dividers between rows
 * - Compatible with other table components
 *
 * @example
 * <TableBody>
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
  ...props
}: TableBodyProps) => {
  return (
    <tbody
      className={cn(
        "divide-y divide-outline dark:divide-outline-dark bg-surface dark:bg-surface-dark",
        className,
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};
