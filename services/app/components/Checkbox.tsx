import { cn } from "@utils/tailwind.ts";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["input"] & {
  label?: string;
};

export const Checkbox = ({ className, label, ...props }: Props) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className={cn(
          "form-checkbox rounded",
          "border-background-300 dark:border-background-700",
          "text-primary-600 dark:text-primary-400",
          "focus:ring-primary-400 dark:focus:ring-primary-600",
          "bg-background-50 dark:bg-background-900",
          className,
        )}
        {...props}
      />
      {label && (
        <span className="ml-2 text-text-900 dark:text-text-100">{label}</span>
      )}
    </label>
  );
};
