import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["a"];

export const ButtonLink: FC<Props> = (
  { children, className, ...rest }: Props,
) => {
  return (
    <a
      {...rest}
      role="button"
      className={cn(
        "whitespace-nowrap rounded-radius bg-primary border border-primary px-4 py-2 text-center text-sm font-medium tracking-wide text-on-primary transition hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-100 active:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-75 dark:border-primary-dark dark:bg-primary-dark dark:text-on-primary-dark dark:focus-visible:outline-primary-dark",
        className,
      )}
    >
      {children}
    </a>
  );
};
