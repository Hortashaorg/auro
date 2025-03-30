import { createRoute, getGlobalContext } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { ProfileNicknameForm } from "@sections/forms/ProfileNicknameForm.tsx";
import { throwError } from "@package/common";
import { getAccountWithUsers } from "@queries/getAccountWithUsers.ts";

const Profile = async () => {
  const context = getGlobalContext();

  const email = context.var.email ??
    throwError("Email not found despite user being logged in");

  const { account } = await getAccountWithUsers(email);

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
          <Text variant="body">
            This is the name that will be used by default when you join new
            servers.
          </Text>
          <ProfileNicknameForm account={account} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title>Server-Specific Names</Title>
          <Text variant="body">
            Customize your name for each server you belong to.
          </Text>
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
