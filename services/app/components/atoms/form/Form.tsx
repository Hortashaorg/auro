import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps, HTMXProps } from "@comp/utils/props.ts";

type FormProps = BaseComponentProps & HTMXProps;

/**
 * Form component with built-in Alpine.js error handling
 *
 * @props
 * - id: Form identifier for targeting with HTMX
 *
 * @example
 * <Form
 *   id="login-form"
 *   hx-post="/api/auth/login"
 *   hx-swap="outerHTML"
 * >
 *   <FormControl inputName="email">
 *     <Label htmlFor="email">Email</Label>
 *     <Input name="email" id="email" type="email" required />
 *   </FormControl>
 *   <Button type="submit">Login</Button>
 * </Form>
 */
export const Form: FC<FormProps> = ({
  className,
  children,
  id,
  ...props
}) => {
  // Add Alpine.js attributes to props
  const formProps = {
    ...props,
    "x-data": "{ errors: {} }",
    "x-on:form-error.document": "errors = $event.detail",
    "x-on:form-clear.document":
      "if ($event.detail?.value) { errors = {}; $el.reset(); }",
    "x-on:input": `$dispatch('form-input', { formId: '${id}' })`,
    className: cn("space-y-4", className),
  };

  return (
    <form {...formProps} id={id}>
      {children}
    </form>
  );
};
