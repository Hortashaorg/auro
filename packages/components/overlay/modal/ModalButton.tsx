import { Button } from "@/inputs/Button.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["button"] & {
  modalRef: string;
};

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
