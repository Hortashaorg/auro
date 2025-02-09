import { cn } from "@utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["form"];

export const Form = ({
  children,
  className,
  ...props
}: Props) => {
  return (
    <form {...props} className={cn("w-full", className)}>
      <Flex direction="col" gap={4}>
        {children}
      </Flex>
    </form>
  );
};
