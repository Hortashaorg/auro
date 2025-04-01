import type { FC } from "@kalena/framework";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { Flex } from "@comp/atoms/layout/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { getAccount } from "@queries/account/getAccount.ts";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Props = BaseComponentProps;

export const DefaultNicknameFlex: FC<Props> = async (props) => {
  const email = getGlobalContext().var.email ?? throwError("Email not found");
  const account = await getAccount(email) ?? throwError("Account not found");

  return (
    <Flex
      id="default-nickname-display"
      direction="col"
      gap="md"
      justify="between"
      {...props}
    >
      <div>
        <Text variant="strong">Current Default:</Text>
        <Text>{account.nickname ?? "No Default Nickname Set"}</Text>
      </div>
      <Button
        variant="outline"
        size="sm"
        hx-get="/api/profile/update-nickname-form"
        hx-target="#default-nickname-display"
        hx-swap="outerHTML"
      >
        Edit
      </Button>
    </Flex>
  );
};
