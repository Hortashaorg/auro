import type { FC, JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["div"] & {
  formId: string;
};

/**
 * FormContext component that provides state management for forms and their associated controls
 *
 * Features:
 * - Manages form dirty state
 * - Handles form submission state
 * - Provides context for buttons and other controls outside the form
 * - Dispatches events when form state changes
 *
 * @example
 * <FormContext formId="my-form">
 *   <Form id="my-form" hx-post="/api/endpoint">
 *     <!-- Form fields -->
 *   </Form>
 *
 *   <Button type="submit" form="my-form">Submit</Button>
 * </FormContext>
 */
export const FormContext: FC<Props> = ({
  children,
  formId,
  className,
  ...props
}: Props) => {
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

  // Listen for clear-form events directly
  props["x-on:clear-form.window"] = `
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
