import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableCellProps = JSX.IntrinsicElements["td"] & {
  isHeader?: boolean;
  align?: "left" | "center" | "right";
  compact?: boolean;
  width?: string;
  truncate?: boolean;
};

/**
 * TableCell component for both header and data cells
 *
 * Features:
 * - Header or data cell rendering
 * - Text alignment options
 * - Compact mode for denser layouts
 * - Fixed width option
 * - Text truncation for long content
 *
 * @example
 * <TableCell isHeader align="center">Column Heading</TableCell>
 * <TableCell align="right" truncate>Long content that will be truncated...</TableCell>
 */
export const TableCell: FC<TableCellProps> = ({
  children,
  className,
  isHeader = false,
  align = "left",
  compact = false,
  width,
  truncate = false,
  ...props
}: TableCellProps) => {
  const Component = isHeader ? "th" : "td";

  const style = width ? { width } : undefined;

  return (
    <Component
      className={cn(
        "px-4",
        compact ? "py-2" : "py-3",
        align === "center" && "text-center",
        align === "right" && "text-right",
        truncate && "whitespace-nowrap overflow-hidden text-ellipsis max-w-xs",
        isHeader
          ? "text-sm font-medium text-text-700 dark:text-text-300"
          : "text-sm text-text-800 dark:text-text-200",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};
