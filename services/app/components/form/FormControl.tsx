import { cn } from "@utils/tailwind.ts";
import type { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {}

export const FormControl = ({ className, ...rest }: Props) => {
  return (
    <div {...rest} className={cn("gap-1 flex flex-grow flex-col", className)}>
    </div>
  );
};
