import type { FC } from "@kalena/framework";
import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { ButtonGroup } from "@comp/atoms/buttons/ButtonGroup.tsx";
import { FormControl } from "@comp/molecules/form/FormControl.tsx";

type EditAccountNicknameFormProps = {
  currentNickname: string;
};

export const EditAccountNicknameForm: FC<EditAccountNicknameFormProps> = (
  { currentNickname },
) => {
  return (
    <Form
      hx-post="/api/profile/update-account-nickname"
      hx-swap="none"
    >
      <FormControl inputName="nickname">
        <Label htmlFor="account-nickname-input" required>
          Default Nickname
        </Label>
        <Input
          id="account-nickname-input"
          name="nickname"
          required
          value={currentNickname}
          placeholder="Enter default nickname"
        />
      </FormControl>
      <ButtonGroup justify="end">
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </ButtonGroup>
    </Form>
  );
};
