import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["section"];

export const Section: FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <section className={cn("w-full space-y-4", className)} {...props}>
      {children}
    </section>
  );
};
