import { BaseLayout } from "@comp/layout/BaseLayout.tsx";
import { cn } from "@comp/utils/tailwind.ts";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "@kalena/framework";
import { Flex } from "@comp/layout/Flex.tsx";
type Props = JSX.IntrinsicElements["div"] & {
  title: string;
};
export const Layout = ({
  title,
  children,
  className,
  ...props
}: Props) => {
  return (
    <BaseLayout title={title}>
      <Navbar />
      <div className="container mx-auto dark:scheme-dark scheme-normal">
        <Flex
          className={cn("w-full", className)}
          direction="col"
          gap="xl"
          {...props}
        >
          {children}
        </Flex>
      </div>
    </BaseLayout>
  );
};
