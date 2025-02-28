import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["header"];

export const Header: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <header
      {...rest}
      className={cn("flex w-full items-center justify-between", className)}
      x-data="{ name:'' }"
    >
      {children}
    </header>
  );
};
