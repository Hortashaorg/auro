import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";

type StatItemProps = JSX.IntrinsicElements["div"] & {
  label: string;
  value: string | number;
  bordered?: boolean;
};

/**
 * StatItem component for displaying labeled statistics in a consistent format
 *
 * Features:
 * - Clean key-value display with space justification
 * - Optional bottom border
 * - Consistent spacing and alignment
 * - Uses Text component for typography consistency
 *
 * @example
 * <StatItem label="Total Views" value="1,234" bordered />
 * <StatItem label="Conversion Rate" value="24%" />
 */
export const StatItem: FC<StatItemProps> = ({
  label,
  value,
  bordered = true,
  className,
  ...props
}: StatItemProps) => {
  return (
    <div
      className={cn(
        "flex justify-between py-3",
        bordered && "border-b border-background-300 dark:border-background-700",
        className,
      )}
      {...props}
    >
      <Text variant="body">{label}</Text>
      <Text variant="body" className="font-semibold">
        {value}
      </Text>
    </div>
  );
};
