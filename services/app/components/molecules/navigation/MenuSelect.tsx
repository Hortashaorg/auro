import { Text } from "@comp/atoms/typography/Text.tsx";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { Button } from "@comp/atoms/buttons/index.ts";

const selectVariants = cva(
  [
    "absolute",
    "grid",
    "rounded-sm",
    "z-20",
    "rounded-lg",
  ],
  {
    variants: {
      variant: {
        single: ["w-48", "grid-cols-1"],
        double: ["w-96", "grid-cols-2"],
      },
      flow: {
        right: [],
        left: ["right-0"],
      },
    },
    defaultVariants: {
      variant: "single",
      flow: "right",
    },
  },
);

type SelectVariants = NonNullableProps<typeof selectVariants>;
type MenuSelectProps = BaseComponentProps & SelectVariants & {
  name: string;
};

/**
 * MenuSelect component for dropdown menu selection
 *
 * @props
 * - name: Identifier and display label for the menu
 * - variant: Layout width of the dropdown ('single', 'double')
 * - flow: Direction the dropdown appears ('right', 'left')
 * - children: Menu items to display in the dropdown
 *
 * @example
 * <MenuSelect name="Options" variant="single" flow="right">
 *   <a className="p-2 hover:bg-surface-alt" href="/profile">Profile</a>
 *   <a className="p-2 hover:bg-surface-alt" href="/settings">Settings</a>
 *   <a className="p-2 hover:bg-surface-alt" href="/logout">Logout</a>
 * </MenuSelect>
 */
export const MenuSelect: FC<MenuSelectProps> = (
  { className, variant, flow, name, children, ...rest }: MenuSelectProps,
) => {
  return (
    <div {...rest} className={cn("relative", className)}>
      <Button
        x-on:click={`name = name == "${name}" ? "" : "${name}"`}
        variant="alternate"
        className="hover:bg-surface dark:hover:bg-surface-dark"
      >
        <Text
          variant="body"
          className="flex items-center justify-between gap-3"
        >
          {name}
          <i data-lucide="chevron-down" width={16} height={16}></i>
        </Text>
      </Button>
      <div
        className={selectVariants({ flow, variant })}
        x-show={`name == "${name}"`}
        x-transition:enter="transition ease-out duration-100"
        x-transition:enter-start="transform opacity-0 scale-95"
        x-transition:enter-end="transform opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-75"
        x-transition:leave-start="transform opacity-100 scale-100"
        x-transition:leave-end="transform opacity-0 scale-95"
        x-cloak
      >
        {children}
      </div>
    </div>
  );
};
