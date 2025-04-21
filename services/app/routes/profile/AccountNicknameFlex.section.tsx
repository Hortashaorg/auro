import { Flex } from "@comp/atoms/layout/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { EditAccountNicknameForm } from "./EditAccountNicknameForm.section.tsx";
import type { FC } from "@kalena/framework";

type Props = {
  currentNickname: string;
};
export const AccountNicknameFlex: FC<Props> = (
  { currentNickname, ...props },
) => {
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
