import { cva } from "class-variance-authority";
import type { JSX } from "preact";
import type { NonNullableProps } from "@utils/types.ts";
import { cn } from "@utils/tailwind.ts";
import { Text } from "@comp/Text.tsx";

const selectVariants = cva(
  [
    "absolute",
    "grid",
    "rounded-sm",
    "z-20",
    "bg-primary-50",
    "rounded-lg",
    "dark:bg-background-800",
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

interface Props extends JSX.HTMLAttributes<HTMLDivElement>, SelectVariants {
  name: string;
}

export const Select = (
  { className, variant, flow, name, children, ...rest }: Props,
) => {
  return (
    <div {...rest} className={cn("relative", className)}>
      <div x-on:click={`name = name == "${name}" ? "" : "${name}"`}>
        {
          <button className="group cursor-pointer py-3 px-5">
            <Text
              variant="paragraph"
              className="flex items-center justify-between gap-3 dark:group-hover:text-text-300 group-hover:text-text-500"
            >
              {name}

              <svg
                className="w-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
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
