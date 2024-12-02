import type { JSX } from "preact";
import { cn } from "@utils/tailwind.ts";

interface Props extends JSX.HTMLAttributes<HTMLElement> {}

export const Menu = ({ className, ...rest }: Props) => {
  return (
    <nav
      {...rest}
      className={cn(
        "flex font-medium px-3",
        className,
      )}
    >
    </nav>
  );
};
