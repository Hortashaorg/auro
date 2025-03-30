import { getGlobalContext } from "@kalena/framework";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { Flex } from "@comp/atoms/layout/index.ts";
import { getAccountWithUsers } from "@queries/getAccountWithUsers.ts";
import { throwError } from "@package/common";

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {userServers.length > 0
            ? (
              userServers.map(({ user, server }) => (
                <TableRow key={server.id}>
                  <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
                  <TableCell>
                    {user.name ?? "No Nickname Set"}
                  </TableCell>
                </TableRow>
              ))
            )
            : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  <Text>You are not currently in any servers.</Text>
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
      <Flex justify="end" className="mt-4">
        <Button
          variant="outline"
          size="sm"
          hx-get="/api/account/edit-server-nicknames-form"
          hx-target="#server-nicknames-section"
          hx-swap="outerHTML"
        >
          Edit Server Names
        </Button>
      </Flex>
    </div>
  );
};
