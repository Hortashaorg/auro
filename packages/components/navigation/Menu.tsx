import { cn } from "@/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["nav"];

export const Menu: FC<Props> = ({ className, children, ...rest }: Props) => {
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
