import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { ServerNicknamesTable } from "./ServerNicknamesTable.section.tsx";
import { AccountNicknameFlex } from "./AccountNicknameFlex.section.tsx";

const Profile = () => {
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
          <Title level="h2" className="mb-2">Default Name</Title>
          <Text variant="body" className="mb-4">
            This is the name that will be used by default when you join new
            servers.
          </Text>
          <AccountNicknameFlex />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Title level="h2">Server-Specific Names</Title>
          <Text variant="body" className="mb-4">
            Customize your name for each server you belong to.
          </Text>
          <ServerNicknamesTable />
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
