import { cn } from "@utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import { Button } from "@comp/Button.tsx";
import { Text } from "@comp/Text.tsx";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["dialog"] & {
  title: string;
  modalRef: string;
};

export const Modal = ({
  title,
  children,
  className,
  modalRef,
  ...props
}: Props) => {
  return (
    <dialog
      className={cn(
        "backdrop:bg-background-950/50",
        "p-6",
        "rounded-lg",
        "dark:bg-background-800",
        "bg-background-100",
        "w-full",
        "max-w-md",
        "border-2",
        "dark:border-background-500",
        "border-background-500",
        className,
      )}
      x-ref={modalRef}
      {...props}
    >
      <Flex direction="col" gap={4}>
        <Flex justify="between" align="center">
          <Text variant="header" className="text-xl">{title}</Text>
          <Button
            variant="outline"
            x-on:click={`$refs.${modalRef}.close()`}
          >
            ✕
          </Button>
        </Flex>
        {children}
      </Flex>
    </dialog>
  );
};
