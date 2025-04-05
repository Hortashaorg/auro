import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { Icon } from "@comp/atoms/typography/index.ts";

const selectButtonVariants = cva([
  "font-body",
  "transition-colors",
  "cursor-pointer",
  "flex",
  "gap-3",
  "items-center",
  "justify-between",
], {
  variants: {
    variant: {
      normal: [
        "relative",
      ],
      fullWidth: [
        "w-full",
      ],
    },
    text: {
      normal: [
        "text-on-surface",
        "dark:text-on-surface-dark",
      ],
      strong: [
        "text-sm",
        "text-on-surface-strong",
        "dark:text-on-surface-dark-strong",
      ],
    },
    textHover: {
      none: [],
      strong: [
        "hover:text-on-surface-strong dark:hover:text-on-surface-dark-strong",
      ],
    },
    background: {
      none: "",
      surfaceAlt: "bg-surface-alt dark:bg-surface-dark-alt",
      surface: "bg-surface dark:bg-surface-dark",
    },
    backgroundHover: {
      none: "",
      surfaceAlt: "hover:bg-surface-alt dark:hover:bg-surface-dark-alt",
      surface: "hover:bg-surface dark:hover:bg-surface-dark",
    },
    size: {
      sm: "text-sm",
      md: "text-base px-4 py-3",
    },
    activeStyle: {
      surface:
        "data-[active=true]:bg-surface data-[active=true]:dark:bg-surface-dark",
      surfaceAlt:
        "data-[active=true]:bg-surface-alt data-[active=true]:dark:bg-surface-dark-alt",
      none: "",
    },
  },
  defaultVariants: {
    variant: "normal",
    text: "normal",
    textHover: "none",
    background: "none",
    backgroundHover: "none",
    size: "md",
    activeStyle: "none",
  },
});

const selectVariants = cva(
  [],
  {
    variants: {
      variant: {
        normal: [
          "absolute",
          "grid",
          "rounded-sm",
          "z-20",
          "rounded-lg",
          "w-48",
          "grid-cols-1",
        ],
        fullWidth: ["flex", "flex-col", "pl-4"],
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

type SelectVariants = NonNullableProps<typeof selectVariants>;
type SelectButtonVariants = NonNullableProps<typeof selectButtonVariants>;

type MenuSelectProps =
  & BaseComponentProps
  & SelectVariants
  & SelectButtonVariants
  & {
    name: string;
    open?: boolean;
    active?: boolean;
  };

/**
 * MenuSelect component for dropdown menu selection
 *
 * @props
 * - name: Identifier and display label for the menu
 * - variant: Layout style of the dropdown ('normal', 'fullWidth')
 * - text: Text color variant ('normal', 'strong')
 * - textHover: Hover text color effect ('none', 'strong')
 * - background: Background color variant ('none', 'surfaceAlt', 'surface')
 * - backgroundHover: Hover background effect ('none', 'surfaceAlt', 'surface')
 * - size: Size variant ('sm', 'md')
 * - activeStyle: Active state styling ('none', 'surface', 'surfaceAlt')
 * - open: Optional boolean to control initial open state
 * - children: Menu items to display in the dropdown
 *
 * @example
 * <MenuSelect name="Options" variant="normal" size="md" textHover="strong">
 *   <Link href="/profile" size="md" background="surfaceAlt" backgroundHover="surface">
 *     Profile
 *   </Link>
 *   <Link href="/settings" size="md" background="surfaceAlt" backgroundHover="surface">
 *     Settings
 *   </Link>
 *   <Link href="/logout" size="md" background="surfaceAlt" backgroundHover="surface">
 *     Logout
 *   </Link>
 * </MenuSelect>
 */
export const MenuSelect: FC<MenuSelectProps> = (
  {
    className,
    variant,
    textHover,
    activeStyle,
    background,
    backgroundHover,
    size,
    text,
    name,
    children,
    open,
    active,
    ...rest
  }: MenuSelectProps,
) => {
  return (
    <div {...rest} className="relative">
      <button
        type="button"
        x-on:click={`name = name == "${name}" ? "" : "${name}"`}
        x-init={`${open ? `name = "${name}"` : ""}`}
        data-active={active}
        className={cn(
          selectButtonVariants({
            variant,
            textHover,
            activeStyle,
            background,
            backgroundHover,
            size,
            text,
          }),
          className,
        )}
      >
        {name}
        <Icon icon="chevron-down" />
      </button>
      <div
        className={selectVariants({ variant })}
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
