import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";

type Props = JSX.IntrinsicElements["div"] & {
  inputName: string; // The name attribute of the input field for error association
  hint?: string; // Optional helper text
};

export const FormControl: FC<Props> = ({
  className,
  children,
  inputName,
  hint,
  ...props
}: Props) => {
  return (
    <div
      className={cn("mb-4", className)}
      {...props}
    >
      {children}

      {hint && (
        <Text
          variant="body"
          className="mt-1 text-sm text-text-500 dark:text-text-400"
        >
          {hint}
        </Text>
      )}

      <Text
        variant="error"
        className="mt-1 text-sm"
        x-show={`errors['${inputName}']`}
        x-text={`errors['${inputName}']`}
      />
    </div>
  );
};
