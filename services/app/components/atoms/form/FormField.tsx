import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type FormFieldProps = BaseComponentProps;

/**
 * FormField provides basic structural grouping for a form field,
 * typically containing a Label and an input Atom.
 * It does not include built-in hints or error messages; use FormControl
 * for that common pattern, or compose hints/errors manually using Text atoms.
 *
 * @props
 * - children: Typically a Label and an input Atom (Input, Textarea, SelectInput, etc.)
 *
 * @example
 * <FormField className="mb-4">
 *   <Label htmlFor="custom-field">Custom Field</Label>
 *   <Input id="custom-field" name="customField" />
 *   // Add custom hints/errors manually if needed
 * </FormField>
 */
export const FormField: FC<FormFieldProps> = ({
  className,
  children,
  ...props
}) => {
  // Basic wrapper, potentially add layout classes like 'flex flex-col' if needed later
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};
