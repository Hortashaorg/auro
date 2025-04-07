import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type TableProps = BaseComponentProps & {
  responsive?: boolean;
};

/**
 * Table component for displaying structured data
 *
 * @props
 * - responsive: Wraps table in scrollable container for mobile
 *
 * @example
 * <Table>
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
        "w-full table-fixed text-left text-sm text-on-surface dark:text-on-surface-dark",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  );

  return responsive
    ? (
      <div className="overflow-hidden w-full overflow-x-auto rounded-radius border border-outline dark:border-outline-dark">
        {tableComponent}
      </div>
    )
    : tableComponent;
};
