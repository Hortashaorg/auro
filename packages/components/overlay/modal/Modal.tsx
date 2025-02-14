import { cn } from "@utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Text } from "@comp/content/Text.tsx";
import type { FC, JSX } from "@hono/hono/jsx";

type Props = JSX.IntrinsicElements["dialog"] & {
  title: string;
  modalRef: string;
};

export const Modal: FC<Props> = ({
  title,
  children,
  className,
  modalRef,
  ...props
}: Props) => {
  props["x-on:close-dialog.window"] = `$refs.${modalRef}.close()`;

  return (
    <dialog
      className={cn(
        "fixed inset-0 m-auto",
        "backdrop:bg-background-950/50",
        "w-full max-w-md",
        "rounded-lg",
        "dark:bg-background-800 bg-background-100",
        "border dark:border-background-700 border-background-300",
        "shadow-lg",
        className,
      )}
      x-ref={modalRef}
      {...props}
    >
      <Flex direction="col" gap={4} className="p-6 w-full">
        <div className="flex items-center justify-between w-full">
          <Text variant="header" className="text-xl">{title}</Text>
          <Button
            variant="outline"
            className="p-2 border-0 hover:bg-background-200 dark:hover:bg-background-700 rounded-full"
            x-on:click={`$refs.${modalRef}.close()`}
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        </div>
        {children}
      </Flex>
    </dialog>
  );
};
