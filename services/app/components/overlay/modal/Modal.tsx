import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Text } from "@comp/content/Text.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["dialog"] & {
  title: string;
  modalRef: string;
};

/**
 * Modal component for displaying content in an overlay dialog
 *
 * Features:
 * - Built on native dialog element for accessibility
 * - Backdrop with semi-transparent background
 * - Title and close button in header
 * - Alpine.js integration for open/close behavior
 * - Responsive sizing with max-width
 * - Dark mode support
 * - Listens for close-dialog events
 *
 * @example
 * <Modal
 *   title="Confirm Action"
 *   modalRef="confirmModal"
 * >
 *   <Text variant="body">Are you sure you want to proceed?</Text>
 *   <Flex justify="end" gap="md">
 *     <Button
 *       variant="outline"
 *       x-on:click="$refs.confirmModal.close()"
 *     >
 *       Cancel
 *     </Button>
 *     <Button
 *       variant="primary"
 *       hx-post="/api/confirm"
 *       hx-swap="none"
 *     >
 *       Confirm
 *     </Button>
 *   </Flex>
 * </Modal>
 */
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
      <Flex direction="col" gap="md" className="p-6 w-full">
        <div className="flex items-center justify-between w-full">
          <Text variant="h1" className="text-xl">{title}</Text>
          <Button
            variant="outline"
            className="p-2 border-0 hover:bg-background-200 dark:hover:bg-background-700 rounded-full"
            x-on:click={`$refs.${modalRef}.close()`}
          >
            <i data-lucide="x"></i>
          </Button>
        </div>
        {children}
      </Flex>
    </dialog>
  );
};
