import { cn } from "@comp/utils/tailwind.ts";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "@kalena/framework";
import { BaseLayout, Flex } from "@comp/wrappers/index.ts";
import { ToastNotificationContainer } from "@comp/feedback/ToastNotificationContainer.tsx";
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
      <div className="container mx-auto dark:scheme-dark scheme-light">
        <Flex
          className={cn("w-full pt-5", className)}
          direction="col"
          gap="xl"
          {...props}
        >
          {children}
        </Flex>
      </div>
      <ToastNotificationContainer />
    </BaseLayout>
  );
};
