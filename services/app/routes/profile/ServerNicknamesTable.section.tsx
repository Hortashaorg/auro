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

export const ServerNicknamesTable = async () => {
  const context = getGlobalContext();
  const email = context.var.email ?? throwError("Email not found");

  const { userServers } = await getAccountWithUsers(email);

  return (
    <div id="server-nicknames-section">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Server Name</TableCell>
            <TableCell isHeader>Your Nickname</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userServers.length > 0
            ? userServers.map(({ user, server }) => {
              return (
                <TableRow
                  key={server.id}
                  id={`nickname-row-${server.id}`}
                >
                  <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
                  <TableCell>
                    <Text>{user.name ?? "No Nickname Set"}</Text>
                  </TableCell>
                  <TableCell>
                    <ModalButton
                      modalRef={`editServerNicknameModal-${server.id}`}
                      variant="outline"
                      size="xs"
                    >
                      Edit
                    </ModalButton>

                    <Modal
                      modalRef={`editServerNicknameModal-${server.id}`}
                      title={`Edit ${server.name} Nickname`}
                    >
                      <EditServerNicknameForm
                        serverId={server.id}
                        currentNickname={user.name ?? ""}
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
    </div>
  );
};
