import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["nav"];

export const Menu: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <nav
      {...rest}
      className={cn(
        "flex font-medium",
        className,
      )}
    >
      {children}
    </nav>
  );
};
