import { Text } from "@comp/content/Text.tsx";
import { cn } from "@comp/utils/tailwind.ts";
import type { NonNullableProps } from "@comp/utils/types.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const selectVariants = cva(
  [
    "absolute",
    "grid",
    "rounded-sm",
    "z-20",
    "bg-primary-50",
    "rounded-lg",
    "dark:bg-background-700",
    "dark:border-background-900",
    "dark:border-2",
    "bg-background-100",
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
  },
);

type SelectVariants = NonNullableProps<
  typeof selectVariants,
  "variant" | "flow"
>;

type Props = JSX.IntrinsicElements["div"] & SelectVariants & {
  name: string;
};

export const Select: FC<Props> = (
  { className, variant, flow, name, children, ...rest }: Props,
) => {
  return (
    <div {...rest} className={cn("relative", className)}>
      <div x-on:click={`name = name == "${name}" ? "" : "${name}"`}>
        {
          <button className="group cursor-pointer py-3 px-5" type="button">
            <Text
              variant="body"
              className="flex items-center justify-between gap-3 dark:group-hover:text-text-300 group-hover:text-text-500"
            >
              {name}
              <i data-lucide="chevron-down" width={16} height={16}></i>
            </Text>
          </button>
        }
      </div>
      <div
        className={selectVariants({ flow, variant })}
        x-show={`name == "${name}"`}
        x-cloak
      >
        {children}
      </div>
    </div>
  );
};
