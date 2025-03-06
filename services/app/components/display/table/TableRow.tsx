import type { FC, JSX } from "@kalena/framework";

type TableRowProps = JSX.IntrinsicElements["tr"];

/**
 * TableRow component for rows within tables
 *
 * @example
 * <TableRow>
 *   <TableCell>Cell content</TableCell>
 * </TableRow>
 */
export const TableRow: FC<TableRowProps> = ({
  children,
  ...props
}: TableRowProps) => {
  return (
    <tr
      {...props}
    >
      {children}
    </tr>
  );
};
