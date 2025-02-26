import type { FC, JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";

type Props = JSX.IntrinsicElements["div"];

/**
 * Container component for creating consistent page layouts
 *
 * Features:
 * - Grows to fill available space
 * - Uses column direction by default
 * - Applies large gap between children
 * - Built on top of the Flex component
 *
 * @example
 * <Container>
 *   <Section>First section content</Section>
 *   <Section>Second section content</Section>
 * </Container>
 */
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
