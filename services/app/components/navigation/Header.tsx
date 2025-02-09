import { cn } from "@utils/tailwind.ts";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["header"];

export const Header = ({ className, children, ...rest }: Props) => {
  return (
    <header
      {...rest}
      className={cn("flex w-full items-center justify-between mb-5", className)}
      x-data="{ name:'' }"
    >
      {children}
    </header>
  );
};
