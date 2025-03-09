import { Button } from "@comp/inputs/Button.tsx";
import type { FC } from "@kalena/framework";

type ButtonProps = Parameters<typeof Button>[0];

type Props = ButtonProps & {
  formId: string;
  disableWhenClean?: boolean;
  disableDuringSubmit?: boolean;
};

/**
 * Button specifically designed to work with forms outside the form element
 *
 * Features:
 * - Automatically links to form via formId
 * - Can be disabled when form is clean (no changes)
 * - Can be disabled during form submission
 * - Inherits all Button component props
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
export const FormButton: FC<Props> = ({
  formId,
  disableWhenClean = false,
  disableDuringSubmit = true,
  ...props
}: Props) => {
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
