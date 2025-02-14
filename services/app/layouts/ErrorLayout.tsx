import { BaseLayout } from "@layouts/BaseLayout.tsx";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["div"] & {
  title: string;
};

export const ErrorLayout = ({
  title,
  children,
}: Props) => {
  return (
    <BaseLayout title={title}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
};
