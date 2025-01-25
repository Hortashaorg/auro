import { cn } from "@utils/tailwind.ts";
import type { JSX } from "preact";

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
