import type { FC, JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";

type Props = JSX.IntrinsicElements["div"];

export const Container: FC<Props> = ({
  children,
  ...props
}) => {
  return (
    <Flex {...props} className="grow" direction="col" gap="lg">
      {children}
    </Flex>
  );
};
