import type { JSX } from "preact";
import { cn } from "@utils/tailwind.ts";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {}

export const FormControl = ({ className, ...rest }: Props) => {
  return (
    <div {...rest} className={cn("gap-1 flex flex-grow flex-col", className)}>
    </div>
  );
};
