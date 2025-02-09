import { cn } from "@utils/tailwind.ts";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["nav"];

export const Menu = ({ className, children, ...rest }: Props) => {
  return (
    <nav
      {...rest}
      className={cn(
        "flex font-medium px-3",
        className,
      )}
    >
      {children}
    </nav>
  );
};
