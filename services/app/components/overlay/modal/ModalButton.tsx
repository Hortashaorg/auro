import { Button } from "@comp/inputs/Button.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["button"] & {
  modalRef: string;
};

/**
 * ModalButton component for triggering modal dialogs
 *
 * Features:
 * - Built on the Button component for consistent styling
 * - Alpine.js integration to show the associated modal
 * - Simple API requiring only the modalRef
 * - Passes through all Button props
 *
 * @example
 * <ModalButton
 *   modalRef="confirmModal"
 *   variant="primary"
 * >
 *   Open Modal
 * </ModalButton>
 *
 * <Modal modalRef="confirmModal" title="Confirmation">
 *   Modal content here
 * </Modal>
 */
export const ModalButton: FC<Props> = (
  { modalRef, children, ...props }: Props,
) => {
  return (
    <Button
      {...props}
      x-on:click={`$refs.${modalRef}.showModal()`}
    >
      {children}
    </Button>
  );
};
