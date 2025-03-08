import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Text } from "@comp/content/Text.tsx";
import type { FC, JSX } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const modalVariants = cva([
  "fixed inset-0 m-auto",
  "w-full",
  "rounded-lg",
  "dark:bg-surface-dark-alt",
  "bg-surface-alt",
], {
  variants: {
    maxWidth: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    },
  },
  defaultVariants: {
    maxWidth: "md",
  },
});

type ModalVariants = NonNullableProps<typeof modalVariants>;

type Props = JSX.IntrinsicElements["dialog"] & ModalVariants & {
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
 * - Closes on blur (clicking outside the modal)
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
  maxWidth,
  ...props
}: Props) => {
  props["x-on:close-dialog.window"] = `$refs.${modalRef}.close()`;
  props["x-on:click"] = `$event.target === $el && $refs.${modalRef}.close()`;

  return (
    <dialog
      className={cn(
        modalVariants({ maxWidth }),
        className,
      )}
      x-ref={modalRef}
      {...props}
    >
      <Flex direction="col" gap="md" className="p-6 w-full">
        <div className="flex items-center justify-between w-full">
          <Text variant="h1" className="text-xl">{title}</Text>
          <Button
            type="button"
            variant="inverse"
            buttonSize="sm"
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
