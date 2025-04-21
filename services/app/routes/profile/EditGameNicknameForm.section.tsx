import type { FC } from "@kalena/framework";
import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { ButtonGroup } from "@comp/atoms/buttons/ButtonGroup.tsx";
import { FormControl } from "@comp/molecules/form/FormControl.tsx";

type EditGameNicknameFormProps = {
  gameId: string;
  currentNickname: string;
};

export const EditGameNicknameForm: FC<EditGameNicknameFormProps> = (
  { gameId, currentNickname },
) => {
  return (
    <Form
      hx-post="/api/profile/update-game-nickname"
      hx-swap="none"
    >
      <input type="hidden" name="gameId" value={gameId} />

      <FormControl inputName="nickname">
        <Label htmlFor={`game-nickname-input-${gameId}`} required>
          New Nickname
        </Label>
        <Input
          id={`game-nickname-input-${gameId}`}
          name="nickname"
          required
          value={currentNickname}
          placeholder="Enter new game nickname"
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
