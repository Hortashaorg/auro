import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["section"];

export const Section: FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <section className={cn("grow w-full", className)} {...props}>
      {children}
    </section>
  );
};
