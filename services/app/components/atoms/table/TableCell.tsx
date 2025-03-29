import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type TableCellProps = JSX.IntrinsicElements["td"] & {
  isHeader?: boolean;
};

/**
 * TableCell component for both header and data cells
 *
 * Features:
 * - Automatically renders as <th> or <td> based on isHeader prop
 * - Consistent styling with the rest of the table components
 * - Properly sets accessibility attributes (scope="col" for headers)
 * - Customizable with className for additional styling
 *
 * @example
 * <TableCell isHeader>Column Heading</TableCell>
 * <TableCell>Cell content</TableCell>
 */
export const TableCell: FC<TableCellProps> = ({
  children,
  className,
  isHeader = false,
  ...props
}: TableCellProps) => {
  const Component = isHeader ? "th" : "td";

  if (isHeader) {
    props["scope"] = "col";
  }

  return (
    <Component
      className={cn(
        "p-4",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
