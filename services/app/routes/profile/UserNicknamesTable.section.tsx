import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { EditGameNicknameForm } from "./EditGameNicknameForm.section.tsx";
import type { FC } from "@kalena/framework";
import { queries } from "@package/database";

type Props = {
  email: string;
};
export const UserNicknamesTable: FC<Props> = async (
  { email, ...props },
) => {
  const userGames = await queries.games.getGamesByEmail(email);

  return (
    <Table id="game-nicknames-section" {...props}>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Game Name</TableCell>
          <TableCell isHeader>Your Nickname</TableCell>
          <TableCell isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userGames.length > 0
          ? userGames.map(({ user, game }, index) => {
            const currentNickname = user.name ?? "";
            const modalRef = `editGameNicknameModal${index}`;

            return (
              <TableRow key={game.id}>
                <TableCell>{game.name ?? "Unnamed Game"}</TableCell>
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
                    title={`Edit Nickname for ${game.name ?? "Game"}`}
                  >
                    <EditGameNicknameForm
                      gameId={game.id}
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
                <Text>You are not currently in any games.</Text>
              </TableCell>
            </TableRow>
          )}
      </TableBody>
    </Table>
  );
};
