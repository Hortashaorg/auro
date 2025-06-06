import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { UserNicknamesTable } from "./UserNicknamesTable.section.tsx";
import { AccountNicknameFlex } from "./AccountNicknameFlex.section.tsx";
import { accountContext } from "@contexts/accountContext.ts";

const Profile = async () => {
  const account = await profileRoute.customContext();

  return (
    <Layout title="Profile Settings">
      <div>
        <Title level="h1" className="mb-2">Profile Settings</Title>
        <Text variant="body">
          Manage your account settings and customize your game names.
        </Text>
      </div>

      <Card>
        <CardBody>
          <Title level="h2" className="mb-2">Default Name</Title>
          <Text variant="body" className="mb-4">
            This is the name that will be used by default when you join new
            games.
          </Text>
          <AccountNicknameFlex currentNickname={account.nickname ?? ""} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title level="h2">Game-Specific Names</Title>
          <Text variant="body" className="mb-4">
            Customize your name for each game you belong to.
          </Text>
          <UserNicknamesTable email={account.email} />
        </CardBody>
      </Card>
    </Layout>
  );
};

export const profileRoute = createRoute({
  path: "/profile",
  component: Profile,
  customContext: accountContext,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
