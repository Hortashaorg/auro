import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";

const selectVariants = cva([
  "rounded-md",
  "border",
  "dark:border-background-700",
  "border-background-300",
  "bg-background-50",
  "dark:bg-background-800",
  "text-text-900",
  "dark:text-text-100",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-primary-500",
  "dark:focus:ring-primary-400",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "w-full",
  "appearance-none",
  "bg-no-repeat",
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]",
  "bg-[length:1.25rem_1.25rem]",
  "bg-[right_0.5rem_center]",
  "pr-10",
], {
  variants: {
    size: {
      default: ["px-4", "py-2"],
      small: ["px-3", "py-1", "text-sm"],
      large: ["px-6", "py-3", "text-lg"],
    },
    state: {
      default: [],
      error: [
        "border-danger-300",
        "dark:border-danger-700",
        "focus:ring-danger-500",
      ],
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

type SelectVariants = NonNullableProps<typeof selectVariants>;
type Props = JSX.IntrinsicElements["select"] & SelectVariants;

export const Select: FC<Props> = ({
  className,
  size,
  state,
  children,
  ...props
}: Props) => {
  return (
    <>
      <select
        {...props}
        className={cn(selectVariants({ size, state }), className)}
      >
        {children}
      </select>
      <Text
        variant="error"
        className="mt-1 text-sm"
        x-show={`errors['${props.name}']`}
        x-text={`errors['${props.name}']`}
      />
    </>
  );
};
