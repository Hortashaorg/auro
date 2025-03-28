import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { Flex } from "@comp/wrappers/Flex.tsx";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Props = BaseComponentProps;

/**
 * HtmxWrapper component for wrapping content with htmx
 *
 * @example
 * <HtmxWrapper>
 *   <div>Content</div>
 * </HtmxWrapper>
 */
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
