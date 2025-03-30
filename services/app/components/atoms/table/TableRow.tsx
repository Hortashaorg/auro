import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type TableRowProps = BaseComponentProps;

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
