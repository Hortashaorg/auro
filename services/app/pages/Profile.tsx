import { createRoute, getGlobalContext } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Text } from "@comp/content/Text.tsx";
import { Card } from "@comp/display/card/Card.tsx";
import { Layout } from "@sections/layout/Layout.tsx";
import { ProfileNicknameForm } from "@sections/profile/ProfileNicknameForm.tsx";
import { ServerNamesList } from "@sections/profile/ServerNamesList.tsx";
import { throwError } from "@package/common";
import { getAccountWithUsers } from "@queries/getAccountWithUsers.ts";
import { CardContent } from "@comp/display/card/CardContent.tsx";

const Profile = async () => {
  const context = getGlobalContext();

  const email = context.var.email ??
    throwError("Email not found despite user being logged in");

  const { account, userServers } = await getAccountWithUsers(email);

  return (
    <Layout title="Profile Settings">
      <div>
        <Text variant="h1" className="mb-2">Profile Settings</Text>
        <Text variant="body">
          Manage your account settings and customize your server names.
        </Text>
      </div>

      <Card>
        <CardContent>
          <Text variant="h3" className="mb-2">Default Name</Text>
          <Text variant="body">
            This is the name that will be used by default when you join new
            servers.
          </Text>
          <ProfileNicknameForm account={account} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Text variant="h3">Server-Specific Names</Text>
          <Text variant="body">
            Customize your name for each server you belong to.
          </Text>
          <ServerNamesList
            userServers={userServers}
            defaultNickname={account.nickname || ""}
          />
        </CardContent>
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
