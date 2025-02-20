import { BaseLayout } from "@comp/layout/BaseLayout.tsx";
import { Navbar } from "@sections/navbar/Navbar.tsx";
import type { JSX } from "@kalena/framework";
import { Main } from "@comp/layout/Main.tsx";

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
        <Main>
          {children}
        </Main>
      </div>
    </BaseLayout>
  );
};
