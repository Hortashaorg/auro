import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];

export const Form: FC<Props> = ({
  children,
  className,
  ...props
}: Props) => {
  props["x-on:input-error.window"] = `console.log($event.detail)`;

  return (
    <form {...props} className={cn("w-full", className)}>
      <Flex direction="col" gap={4}>
        {children}
      </Flex>
    </form>
  );
};
