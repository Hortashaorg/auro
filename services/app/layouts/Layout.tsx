import { BaseLayout } from "@layouts/BaseLayout.tsx";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["div"] & {
  title: string;
};
export const Layout = ({
  title,
  children,
}: Props) => {
  return (
    <BaseLayout title={title}>
      <div className="container mx-auto p-4" x-data="{}">
        <Navbar />
        <div>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
