import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type NavProps = BaseComponentProps;

/**
 * Navigation wrapper component
 *
 * @example
 * <Nav>
 *   <Menu>
 *     <Link href="/">Home</Link>
 *     <Link href="/about">About</Link>
 *   </Menu>
 * </Nav>
 */
export const Nav: FC<NavProps> = (
  { className, children, ...props }: NavProps,
) => {
  return (
    <nav
      {...props}
      className={cn(
        "flex items-center justify-between bg-surface-alt border-outline dark:border-outline-dark px-6 dark:bg-surface-dark-alt",
        className || "",
      )}
      aria-label="top menu"
      x-data="{ name:'' }"
    >
      {children}
    </nav>
  );
};
