import type { FC } from "@kalena/framework";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";
import { getGlobalContext } from "@kalena/framework";
import { getAccount } from "@queries/getAccount.ts";
import { throwError } from "@package/common";
import { FormControl } from "@comp/molecules/form/FormControl.tsx";

export const DefaultNicknameForm: FC = async () => {
  const email = getGlobalContext().var.email ?? throwError("Email not found");
  const account = await getAccount(email) ?? throwError("Account not found");

  return (
    <Form
      hx-post="/api/account/update-nickname"
      hx-target="#default-nickname-display"
      hx-swap="outerHTML"
    >
      <Flex direction="col" gap="md">
        <FormControl inputName="nickname">
          <Label htmlFor="account-nickname" required>Default Nickname</Label>
          <Input
            id="account-nickname"
            name="nickname"
            required
            value={account.nickname ?? ""}
            placeholder="Enter your default nickname"
          />
        </FormControl>
        <Flex justify="end" gap="sm">
          <Button
            type="button"
            variant="outline"
            hx-get="/api/account/cancel-nickname-edit"
            hx-target="#default-nickname-display"
            hx-swap="outerHTML"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </Flex>
      </Flex>
    </Form>
  );
};
