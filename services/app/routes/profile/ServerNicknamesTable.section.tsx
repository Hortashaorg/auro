import { getGlobalContext } from "@kalena/framework";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { getAccountWithUsers } from "@queries/account/getAccountWithUsers.ts";
import { throwError } from "@package/common";
import { EditServerNicknameForm } from "./EditServerNicknameForm.section.tsx";
import type { FC } from "@kalena/framework";

export const ServerNicknamesTable: FC = async (props) => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const { userServers } = await getAccountWithUsers(email);

  return (
    <Table id="server-nicknames-section" {...props}>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Server Name</TableCell>
          <TableCell isHeader>Your Nickname</TableCell>
          <TableCell isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userServers.length > 0
          ? userServers.map(({ user, server }, index) => {
            const currentNickname = user.name ?? "";
            const modalRef = `editServerNicknameModal${index}`;

            return (
              <TableRow key={server.id}>
                <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
                <TableCell>
                  <Text>{currentNickname || "No Nickname Set"}</Text>
                </TableCell>
                <TableCell>
                  <ModalButton
                    modalRef={modalRef}
                    variant="outline"
                    size="xs"
                  >
                    Edit
                  </ModalButton>
                  <Modal
                    modalRef={modalRef}
                    title={`Edit Nickname for ${server.name ?? "Server"}`}
                  >
                    <EditServerNicknameForm
                      serverId={server.id}
                      currentNickname={currentNickname}
                    />
                  </Modal>
                </TableCell>
              </TableRow>
            );
          })
          : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <Text>You are not currently in any servers.</Text>
              </TableCell>
            </TableRow>
          )}
      </TableBody>
    </Table>
  );
};
