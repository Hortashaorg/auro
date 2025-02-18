import { BaseLayout } from "@comp/layout/BaseLayout.tsx";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["div"] & {
  title: string;
};
export const Layout = ({
  title,
  children,
}: Props) => {
  return (
    <BaseLayout title={title}>
      <div className="container mx-auto p-4 px-10">
        <Navbar />
        <div>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
