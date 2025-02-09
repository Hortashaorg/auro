import { Button } from "@comp/Button.tsx";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["button"] & {
  modalRef: string;
};

export const ModalButton = ({ modalRef, children, ...props }: Props) => {
  return (
    <Button
      {...props}
      x-on:click={`$refs.${modalRef}.showModal()`}
    >
      {children}
    </Button>
  );
};
