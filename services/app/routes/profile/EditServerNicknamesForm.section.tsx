import type { FC } from "@kalena/framework";
import { Form, Input } from "@comp/atoms/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import { ButtonGroup } from "@comp/atoms/buttons/ButtonGroup.tsx";
import type { getAccountWithUsers } from "@queries/account/getAccountWithUsers.ts";

type UserServer = Awaited<
  ReturnType<typeof getAccountWithUsers>
>["userServers"][number];

type EditServerNicknamesFormProps = {
  userServers: UserServer[];
};

export const EditServerNicknamesForm: FC<EditServerNicknamesFormProps> = (
  { userServers },
) => {
  return (
    <div id="server-nicknames-section">
      <Form
        hx-post="/api/profile/update-server-nicknames"
        hx-target="#server-nicknames-section"
        hx-swap="outerHTML"
        id="edit-server-nicknames-form"
        className="space-y-4"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Server Name</TableCell>
              <TableCell isHeader>Your Nickname</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userServers.map(({ user, server }) => (
              <TableRow key={server.id}>
                <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    name={`server_${server.id}_nickname`}
                    value={user.name ?? ""}
                    placeholder="Enter nickname"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ButtonGroup className="mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            hx-get="/api/profile/cancel-edit-server-nicknames"
            hx-target="#server-nicknames-section"
            hx-swap="outerHTML"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Changes
          </Button>
        </ButtonGroup>
      </Form>
    </div>
  );
};
