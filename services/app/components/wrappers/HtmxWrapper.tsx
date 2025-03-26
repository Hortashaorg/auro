import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Flex } from "@comp/wrappers/Flex.tsx";

type Props = JSX.IntrinsicElements["div"] & {
  className?: string;
};

export const HtmxWrapper: FC<Props> = ({
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
