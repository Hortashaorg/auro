import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableProps = JSX.IntrinsicElements["table"] & {
  zebra?: boolean;
  compact?: boolean;
  responsive?: boolean;
};

/**
 * Table component for displaying structured data
 *
 * Features:
 * - Composable with other table components
 * - Optional horizontal scrolling for responsive layouts
 * - Support for zebra striping
 * - Compact mode for denser UIs
 * - Works with Alpine.js for dynamic data
 *
 * @example
 * <Table zebra>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
 * </Table>
 */
export const Table: FC<TableProps> = ({
  children,
  className,
  responsive = true,
  ...props
}: TableProps) => {
  const tableComponent = (
    <table
      className={cn(
        "w-full border-collapse",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  );

  return responsive
    ? (
      <div className="w-full overflow-x-auto">
        {tableComponent}
      </div>
    )
    : tableComponent;
};
