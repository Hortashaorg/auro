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
      // No Alpine needed here; API response handles modal close & OOB swap
      hx-post="/api/profile/update-single-server-nickname"
      hx-target={`#nickname-row-${serverId}`} // Target specific row for OOB swap
      hx-swap="outerHTML"
      // Include both serverId (hidden) and nickname
      hx-include="[name='serverId'], [name='nickname']"
      class="flex flex-col gap-md"
    >
      {/* Hidden input for server ID */}
      <input type="hidden" name="serverId" value={serverId} />

      <FormControl inputName="nickname">
        <Label htmlFor={`server-nickname-input-${serverId}`} required>
          New Nickname
        </Label>
        <Input
          id={`server-nickname-input-${serverId}`}
          name="nickname"
          required
          value={currentNickname} // Pre-fill
          placeholder="Enter new server nickname"
        />
      </FormControl>
      <ButtonGroup justify="end">
        {/* Standard dismiss button for modal */}
        <Button type="button" variant="outline" data-dismiss="modal">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </ButtonGroup>
    </Form>
  );
};
