import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];

export const Form: FC<Props> = ({
  children,
  className,
  ...props
}: Props) => {
  props["x-data"] = "{ errors: {} }";
  props["x-on:clear-form.window"] = `
    $el.reset();
    errors = {};
  `;
  props["x-on:form-error.window"] = `errors = $event.detail`;

  return (
    <form {...props} className={cn("w-full", className)}>
      <Flex direction="col" gap="md">
        {children}
      </Flex>
    </form>
  );
};
