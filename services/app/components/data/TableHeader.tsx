import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableHeaderProps = JSX.IntrinsicElements["thead"] & {
  variant?: "default" | "minimal" | "separated";
};

/**
 * TableHeader component for the header section of tables
 *
 * Features:
 * - Multiple styling variants
 * - Consistent design system integration
 * - Composable with Table and TableRow
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
  variant = "default",
  ...props
}: TableHeaderProps) => {
  return (
    <thead
      className={cn(
        variant === "default" && "bg-background-50 dark:bg-background-900",
        variant === "separated" &&
          "border-b-2 border-background-300 dark:border-background-700",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};
