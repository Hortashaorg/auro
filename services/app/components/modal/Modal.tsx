import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/wrappers/Flex.tsx";
import { Button } from "../buttons/index.ts";
import { Text } from "../typography/index.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

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

type ModalProps = BaseComponentProps & ModalVariants & {
  title: string;
  modalRef: string;
};

/**
 * Modal component for displaying content in an overlay dialog
 *
 * @props
 * - title: Text displayed in the modal header
 * - modalRef: Reference name for Alpine.js to access this modal
 * - maxWidth: Maximum width of the modal ('sm', 'md', 'lg', 'xl')
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
export const Modal: FC<ModalProps> = ({
  title,
  children,
  className,
  modalRef,
  maxWidth,
  ...props
}: ModalProps) => {
  props["x-on:close-dialog.window"] = `$refs.${modalRef}.close()`;
  props["x-on:click"] = `$event.target === $el && $refs.${modalRef}.close()`;

  return (
    <dialog
      className={cn(
        modalVariants({ maxWidth }),
        className || "",
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
