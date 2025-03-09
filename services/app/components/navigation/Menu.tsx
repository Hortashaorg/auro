import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["ul"];

export const Menu: FC<Props> = ({ className, children, ...rest }: Props) => {
  return (
    <div
      {...rest}
      className={cn(
        "hidden items-center md:flex",
        className,
      )}
    >
      {children}
    </div>
  );
};
