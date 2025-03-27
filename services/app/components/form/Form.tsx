import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

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
type FormProps = BaseComponentProps;

export const Form: FC<FormProps> = ({
  className,
  children,
  ...props
}) => {
  // Add Alpine.js attributes to props
  const formProps = {
    ...props,
    "x-data": "{ errors: {} }",
    "x-on:form-error.document": "errors = $event.detail",
    "x-on:clear-form.document":
      "if ($event.detail?.value) { errors = {}; $el.reset(); }",
    className: cn("space-y-4", className),
  };

  return (
    <form {...formProps}>
      {children}
    </form>
  );
};
