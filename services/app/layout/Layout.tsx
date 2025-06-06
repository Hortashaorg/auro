import { cn } from "@comp/utils/tailwind.ts";
import { Navbar } from "./Navbar.tsx";
import type { JSX } from "@kalena/framework";
import { BaseLayout } from "@comp/molecules/layout/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";
import { ToastNotifications } from "@comp/molecules/feedback/index.ts";
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
      <div className="container mx-auto dark:scheme-dark scheme-light px-5">
        <Flex
          className={cn("w-full pt-5", className)}
          direction="col"
          gap="xl"
          {...props}
        >
          {children}
        </Flex>
      </div>
      <ToastNotifications />
    </BaseLayout>
  );
};
