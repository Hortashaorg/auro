import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/layout/Flex.tsx";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];

/**
 * Form component with built-in Alpine.js state management for errors
 *
 * Features:
 * - Automatic error handling with Alpine.js
 * - Listens for form-error events to display validation errors
 * - Supports clear-form events to reset the form
 * - Consistent layout with Flex component
 *
 * @example
 * <Form
 *   hx-post="/api/submit-form"
 *   hx-swap="none"
 * >
 *   <FormControl inputName="name">
 *     <Label htmlFor="name" required>Name</Label>
 *     <Input id="name" name="name" required />
 *   </FormControl>
 *
 *   <Button type="submit">Submit</Button>
 * </Form>
 */
export const Form: FC<Props> = ({
  children,
  className,
  ...props
}: Props) => {
  props["x-data"] = "{ errors: {} }";
  props["x-on:clear-form.window"] = `
    $el.reset();
    errors = {};
  `;
  props["x-on:form-error.window"] = `errors = $event.detail`;

  return (
    <form {...props} className={cn("w-full", className)}>
      <Flex direction="col" gap="md">
        {children}
      </Flex>
    </form>
  );
};
