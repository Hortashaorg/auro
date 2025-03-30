import { createRoute, getGlobalContext } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { throwError } from "@package/common";
import { getAccountWithUsers } from "@queries/getAccountWithUsers.ts";
import { Button } from "@comp/atoms/buttons/Button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { DefaultNicknameDisplay } from "@sections/views/DefaultNicknameDisplay.tsx";

const Profile = async () => {
  const context = getGlobalContext();

  const email = context.var.email ??
    throwError("Email not found despite user being logged in");

  const { userServers } = await getAccountWithUsers(email);

  return (
    <Layout title="Profile Settings">
      <div>
        <Title level="h1" className="mb-2">Profile Settings</Title>
        <Text variant="body">
          Manage your account settings and customize your server names.
        </Text>
      </div>

      <Card>
        <CardBody>
          <Title className="mb-2">Default Name</Title>
          <Text variant="body" className="mb-4">
            This is the name that will be used by default when you join new
            servers.
          </Text>
          <DefaultNicknameDisplay />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title>Server-Specific Names</Title>
          <Text variant="body" className="mb-4">
            Customize your name for each server you belong to.
          </Text>
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
                ? (
                  userServers.map(({ user, server }) => (
                    <TableRow key={server.id}>
                      <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
                      <TableCell>
                        {user.name ?? "No Nickname Set"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
                : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Text>You are not currently in any servers.</Text>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </Layout>
  );
};

export const profileRoute = createRoute({
  path: "/profile",
  component: Profile,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
