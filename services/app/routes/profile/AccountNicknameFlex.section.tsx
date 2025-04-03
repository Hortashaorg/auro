// import { Button } from "@comp/atoms/buttons/Button.tsx"; // Removed unused import
import { Flex } from "@comp/atoms/layout/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { getAccount } from "@queries/account/getAccount.ts";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { EditAccountNicknameForm } from "./EditAccountNicknameForm.section.tsx";
import type { FC } from "@kalena/framework";

export const AccountNicknameFlex: FC = async (props) => {
  const email = getGlobalContext().var.email ?? throwError("Email not found");
  const account = await getAccount(email) ?? throwError("Account not found");

  const currentNickname = account.nickname ?? "";

  return (
    <Flex
      id="account-nickname-flex"
      direction="row"
      justify="between"
      align="center"
      {...props}
    >
      <div>
        <Text variant="strong">Current Default:</Text>
        <Text>{currentNickname || "No Default Nickname Set"}</Text>
      </div>
      <ModalButton
        modalRef="editAccountNicknameModal"
        variant="outline"
        size="sm"
      >
        Edit
      </ModalButton>
      <Modal modalRef="editAccountNicknameModal" title="Edit Default Nickname">
        <EditAccountNicknameForm currentNickname={currentNickname} />
      </Modal>
    </Flex>
  );
};
