import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type FormContextProps = BaseComponentProps & {
  formId: string;
};

/**
 * FormContext component that provides state management for forms and their associated controls
 *
 * @props
 * - formId: ID of the form to manage
 * - children: Form and related components
 *
 * @example
 * <FormContext formId="my-form">
 *   <Form id="my-form" hx-post="/api/endpoint">
 *     <FormControl inputName="email">
 *       <Label htmlFor="email">Email</Label>
 *       <Input id="email" name="email" />
 *     </FormControl>
 *   </Form>
 *
 *   <FormButton formId="my-form" disableWhenClean>Submit</FormButton>
 * </FormContext>
 */
export const FormContext: FC<FormContextProps> = ({
  children,
  formId,
  className,
  ...props
}: FormContextProps) => {
  // Create Alpine.js data with form state
  const alpineData = JSON.stringify({
    formIsDirty: false,
    isSubmitting: false,
    formId: formId,
  });

  // Add x-data directive
  props["x-data"] = alpineData;

  // Add event listeners for form state management
  props["x-init"] = `
    // Handle form submission start
    document.body.addEventListener('htmx:beforeRequest', function(event) {
      const form = event.detail.elt;
      if (form.id === '${formId}') {
        isSubmitting = true;
      }
    });
    
    // Handle form submission completion
    document.body.addEventListener('htmx:afterRequest', function(event) {
      const form = event.detail.elt;
      if (form.id === '${formId}') {
        isSubmitting = false;
      }
    });
  `;

  // Listen for form-input events from the form
  props["x-on:form-input.window"] = `
    if ($event.detail && $event.detail.formId === '${formId}') {
      formIsDirty = true;
    }
  `;

  // Listen for form-clear events directly
  props["x-on:form-clear.window"] = `
    if ($event.detail && $event.detail.value === true) {
      formIsDirty = false;
      isSubmitting = false;
    }
  `;

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
