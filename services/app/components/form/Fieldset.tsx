import { cn } from "@utils/tailwind.ts";
import type { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLFieldSetElement> {}

export const Fieldset = ({ className, ...rest }: Props) => {
  return (
    <fieldset {...rest} className={cn("border p-4", className)}>
    </fieldset>
  );
};
