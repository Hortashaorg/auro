import { cn } from "@comp/utils/tailwind.ts";
import { Flex } from "@comp/wrappers/index.ts";
import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];

/**
 * Form component with built-in Alpine.js state management for errors
 *
 * Features:
 * - Automatic error handling with Alpine.js
 * - Listens for form-error events to display validation errors
 * - Supports clear-form events to reset the form
 * - Dispatches form-input events to notify parent context of changes
 * - Consistent layout with Flex component
 *
 * @example
 * <Form
 *   id="my-form"
 *   hx-post="/api/submit-form"
 *   hx-swap="none"
 * >
 *   <FormControl inputName="name">
 *     <Label htmlFor="name" required>Name</Label>
 *     <Input id="name" name="name" required />
 *   </FormControl>
 * </Form>
 */
export const Form: FC<Props> = ({
  children,
  className,
  id,
  ...props
}: Props) => {
  // Basic error handling
  props["x-data"] = "{ errors: {} }";

  // Listen for clear-form events directly
  props["x-on:clear-form.window"] = `
    if ($event.detail && $event.detail.value === true) {
      $el.reset();
      errors = {};
    }
  `;

  // Handle form-error events
  props["x-on:form-error.window"] = `errors = $event.detail`;

  // Notify parent context when form inputs change
  props["x-on:input"] = `$dispatch('form-input', { formId: '${id}' })`;

  return (
    <form id={id} {...props} className={cn("w-full", className)}>
      <Flex direction="col" gap="md">
        {children}
      </Flex>
    </form>
  );
};
