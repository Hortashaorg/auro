import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type MenuProps = BaseComponentProps;

/**
 * Menu component for navigation items
 *
 * @example
 * <Menu>
 *   <Link href="/">Home</Link>
 *   <Link href="/about">About</Link>
 * </Menu>
 */
export const Menu: FC<MenuProps> = (
  { className, children, ...props }: MenuProps,
) => {
  return (
    <div
      {...props}
      className={cn(
        "items-center flex",
        className || "",
      )}
    >
      {children}
    </div>
  );
};
