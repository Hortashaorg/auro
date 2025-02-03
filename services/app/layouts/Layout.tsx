import { BaseLayout } from "@layouts/BaseLayout.tsx";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "preact";

export const Layout = (props: {
  title: string;
  children: JSX.Element[] | JSX.Element;
}) => {
  const { title, children } = props;
  return (
    <BaseLayout title={title}>
      <div className="container mx-auto p-4">
        <Navbar />
        <div>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
