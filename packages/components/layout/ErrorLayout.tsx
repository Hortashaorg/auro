import { BaseLayout } from "@/layout/BaseLayout.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["div"] & {
  title: string;
};

export const ErrorLayout: FC<Props> = ({
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
