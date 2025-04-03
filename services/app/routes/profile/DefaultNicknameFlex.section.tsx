import { Button } from "@comp/atoms/buttons/Button.tsx";
import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { getAccount } from "@queries/account/getAccount.ts";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { FormControl } from "@comp/molecules/form/FormControl.tsx";
import { ButtonGroup } from "@comp/atoms/buttons/ButtonGroup.tsx";

export const DefaultNicknameFlex = async () => {
  const email = getGlobalContext().var.email ?? throwError("Email not found");
  const account = await getAccount(email) ?? throwError("Account not found");

  const currentNickname = account.nickname ?? "";
  const escapedNickname = currentNickname.replace(/'/g, "\\'");

  return (
    <Flex
      id="default-nickname-display"
      direction="col"
      gap="md"
      x-data={`{ isEditing: false, nickname: '${escapedNickname}' }`}
    >
      <Flex
        direction="col"
        x-show="!isEditing"
        gap="md"
      >
        <Text variant="strong">Current Default:</Text>
        <Text x-text="nickname || 'No Default Nickname Set'"></Text>
        <Button
          variant="outline"
          size="sm"
          x-on:click="isEditing = true"
        >
          Edit
        </Button>
      </Flex>

      <Form
        x-show="isEditing"
        hx-post="/api/profile/update-nickname"
        hx-target="#default-nickname-display"
        hx-swap="outerHTML"
      >
        <Label htmlFor="account-nickname-input">
          Current Default:
        </Label>
        <FormControl inputName="nickname" class="flex-grow">
          <Input
            id="account-nickname-input"
            name="nickname"
            required
            x-model="nickname"
            placeholder="Enter your default nickname"
          />
        </FormControl>
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            x-on:click="isEditing = false"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Changes
          </Button>
        </ButtonGroup>
      </Form>
    </Flex>
  );
};
