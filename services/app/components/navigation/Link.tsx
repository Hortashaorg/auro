import { Text } from "@comp/content/Text.tsx";
import { cn } from "@utils/tailwind.ts";
import type { NonNullableProps } from "@utils/types.ts";
import { cva } from "class-variance-authority";
import type { JSX } from "@package/framework";

const linkVariants = cva(["py-3"], {
  variants: {
    variant: {
      navLink: ["group", "px-5"],
      dropdownLink: [
        "block",
        "text-center",
        "px-5",
        "dark:hover:bg-background-700",
        "hover:bg-background-200",
      ],
    },
  },
});

type LinkVariants = NonNullableProps<typeof linkVariants, "variant">;

type Props = JSX.IntrinsicElements["a"] & LinkVariants;

export const Link = ({ className, variant, children, ...rest }: Props) => {
  return (
    <a
      {...rest}
      className={cn(linkVariants({ variant }), className)}
    >
      <Text variant="paragraph" className="group-hover:text-text-400">
        {children}
      </Text>
    </a>
  );
};
