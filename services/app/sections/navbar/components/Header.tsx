import { JSX } from "preact";
import { cn } from "@utils/tailwind.ts";

interface Props extends JSX.HTMLAttributes<HTMLElement> {}

export const Header = ({ className, ...rest }: Props) => {
  return (
    <header
      {...rest}
      className={cn("flex w-full items-center justify-between mb-5", className)}
      x-data="{ name:'' }"
    >
    </header>
  );
};
