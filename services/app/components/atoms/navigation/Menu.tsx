import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const menuVariants = cva([], {
  variants: {
    variant: {
      horizontal: "flex items-center",
      vertical: "flex flex-col overflow-y-auto p-4",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
});

type MenuVariants = NonNullableProps<typeof menuVariants>;
type MenuProps = BaseComponentProps & MenuVariants;
/**
 * Menu component for navigation items
 *
 * @params
 * - variant: Layout width of the dropdown ('desktop', 'mobile')
 *
 * @example
 * <Menu>
 *   <Link href="/">Home</Link>
 *   <Link href="/about">About</Link>
 * </Menu>
 */
export const Menu: FC<MenuProps> = (
  { className, children, variant, ...props },
) => {
  return (
    <div
      {...props}
      className={cn(
        menuVariants({ variant }),
        className,
      )}
    >
      {children}
    </div>
  );
};
