import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { Text } from "@comp/atoms/typography/index.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type FormControlProps = BaseComponentProps & {
  inputName: string; // The name attribute of the input field for error association
  hint?: string; // Optional helper text
};

/**
 * FormControl wraps form inputs with consistent styling and error handling
 *
 * @props
 * - inputName: The name attribute of the input field for error association
 * - hint: Optional helper text
 *
 * @example
 * <FormControl inputName="email" hint="We'll never share your email">
 *   <Label htmlFor="email" required>Email Address</Label>
 *   <Input id="email" name="email" type="email" required />
 * </FormControl>
 */
export const FormControl: FC<FormControlProps> = ({
  className,
  children,
  inputName,
  hint,
  ...props
}) => {
  return (
    <div
      className={cn("mb-4", className)}
      {...props}
    >
      {children}

      {hint && (
        <Text variant="body" size="sm" className="mt-1">
          {hint}
        </Text>
      )}

      <Text
        variant="error"
        size="sm"
        className="mt-1"
        x-show={`errors && errors['${inputName}']`}
        x-text={`errors['${inputName}']`}
      />
    </div>
  );
};
