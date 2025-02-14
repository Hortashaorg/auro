import { cn } from "@utils/tailwind.ts";
import type { FC, JSX } from "@hono/hono/jsx";

type Props = JSX.IntrinsicElements["button"];

export const NavButton: FC<Props> = (
  { className, children, ...rest }: Props,
) => {
  return (
    <button
      {...rest}
      className={cn(
        "px-5 hover:text-text-500 dark:hover:text-text-300 text-base font-normal dark:text-text-200 text-text-800 font-body leading-loose",
        className,
      )}
    >
      {children}
    </button>
  );
};
