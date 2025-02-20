import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";

type Props = JSX.IntrinsicElements["main"];

export const Main: FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Flex
      className={cn("w-full", className)}
      direction="col"
      gap="xl"
      {...props}
    >
      {children}
    </Flex>
  );
};
