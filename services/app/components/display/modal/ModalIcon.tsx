import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const modalIconVariants = cva(
  [
    "relative",
    "flex items-center justify-center",
    "rounded-full",
    "cursor-pointer",
    "transition-colors duration-200",
    "group",
    "p-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "hover:bg-surface-alt",
          "dark:hover:bg-surface-dark-alt",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ModalIconVariants = NonNullableProps<typeof modalIconVariants>;

type Props = JSX.IntrinsicElements["button"] & ModalIconVariants & {
  modalRef: string;
  icon?: string;
  label?: string;
  className?: string;
};

/**
 * ModalIcon component for triggering modal dialogs within tables
 *
 * Features:
 * - Compact design optimized for table cells
 * - Optional icon and aria label
 * - Alpine.js integration to show the associated modal
 * - Minimal styling to integrate with table designs
 *
 * @example
 * <ModalIcon
 *   modalRef="resourceModal"
 *   icon="+"
 *   label="Add resource"
 * />
 *
 * <Modal modalRef="resourceModal" title="Add Resource">
 *   Modal content here
 * </Modal>
 */
export const ModalIcon: FC<Props> = (
  { modalRef, icon = "+", label = "Open modal", className, variant, ...props }:
    Props,
) => {
  return (
    <button
      type="button"
      className={cn(
        modalIconVariants({ variant }),
        className,
      )}
      aria-label={label}
      x-on:click={`$refs.${modalRef}.showModal()`}
      {...props}
    >
      <i data-lucide={icon}></i>
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-surface-dark dark:bg-surface-dark-alt text-on-surface-dark-strong px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {label}
      </span>
    </button>
  );
};
