import type { JSX } from "preact";
import { cn } from "@utils/tailwind.ts";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {}

export const NavButton = ({ className, ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={cn(
        "px-5 hover:text-text-500 dark:hover:text-text-300 text-base font-normal dark:text-text-200 text-text-800 font-body leading-loose",
        className,
      )}
    >
    </button>
  );
};
