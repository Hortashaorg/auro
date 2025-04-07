import type { FC } from "@kalena/framework";
import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { ButtonGroup } from "@comp/atoms/buttons/ButtonGroup.tsx";
import { FormControl } from "@comp/molecules/form/FormControl.tsx";

type EditServerNicknameFormProps = {
  serverId: string;
  currentNickname: string;
};

export const EditServerNicknameForm: FC<EditServerNicknameFormProps> = (
  { serverId, currentNickname },
) => {
  return (
    <Form
      hx-post="/api/profile/update-server-nickname"
      hx-swap="none"
    >
      <input type="hidden" name="serverId" value={serverId} />

      <FormControl inputName="nickname">
        <Label htmlFor={`server-nickname-input-${serverId}`} required>
          New Nickname
        </Label>
        <Input
          id={`server-nickname-input-${serverId}`}
          name="nickname"
          required
          value={currentNickname}
          placeholder="Enter new server nickname"
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
