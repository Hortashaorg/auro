import { Button } from "../buttons/Button.tsx";
import type { FC } from "@kalena/framework";

type ButtonProps = Parameters<typeof Button>[0];

type FormButtonProps = ButtonProps & {
  formId: string;
  disableWhenClean?: boolean;
  disableDuringSubmit?: boolean;
  variant?: ButtonProps["variant"];
};

/**
 * Button specifically designed to work with forms outside the form element
 *
 * @props
 * - formId: ID of the form to submit
 * - disableWhenClean: Whether to disable the button when form has no changes
 * - disableDuringSubmit: Whether to disable the button during form submission
 * - variant: Visual style of the button (inherited from Button component)
 * - All Button component props are supported
 *
 * @example
 * <FormButton
 *   formId="my-form"
 *   disableWhenClean
 *   disableDuringSubmit
 *   variant="primary"
 * >
 *   Save Changes
 * </FormButton>
 */
export const FormButton: FC<FormButtonProps> = ({
  formId,
  disableWhenClean = false,
  disableDuringSubmit = true,
  ...props
}: FormButtonProps) => {
  // Set disabled binding based on options
  let disabledBinding = "";

  if (disableWhenClean && disableDuringSubmit) {
    disabledBinding = "!formIsDirty || isSubmitting";
  } else if (disableWhenClean) {
    disabledBinding = "!formIsDirty";
  } else if (disableDuringSubmit) {
    disabledBinding = "isSubmitting";
  }

  if (disabledBinding) {
    props["x-bind:disabled"] = disabledBinding;
  }

  return (
    <Button
      {...props}
      form={formId}
      type="submit"
    />
  );
};
