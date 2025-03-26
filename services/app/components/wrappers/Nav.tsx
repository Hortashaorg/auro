import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["nav"];

export const Nav: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <nav
      {...rest}
      className={cn(
        "flex items-center justify-between bg-surface-alt border-outline dark:border-outline-dark px-6 py-4 dark:bg-surface-dark-alt",
        className,
      )}
      aria-label="top menu"
      x-data="{ name:'' }"
    >
      {children}
    </nav>
  );
};
