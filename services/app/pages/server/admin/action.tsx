import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { Badge } from "@comp/content/Badge.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { Tab } from "@comp/layout/tabs/Tab.tsx";
import { Tabs } from "@comp/layout/tabs/Tabs.tsx";
import { TabsList } from "@comp/layout/tabs/TabsList.tsx";
import { TabsTrigger } from "@comp/layout/tabs/TabsTrigger.tsx";
import { StatItem } from "@comp/content/StatItem.tsx";
import { Switch } from "@comp/inputs/Switch.tsx";

const ActionDetail = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  if (!serverId) throwError("No serverId");
  if (!actionId) throwError("No actionId");

  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
    description: schema.action.description,
    cooldownMinutes: schema.action.cooldownMinutes,
    repeatable: schema.action.repeatable,
    assetUrl: schema.asset.url,
    locationName: schema.location.name,
  }).from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .leftJoin(schema.location, eq(schema.action.locationId, schema.location.id))
    .where(
      eq(schema.action.id, actionId),
    );

  const action = actions[0] ?? throwError("Action not found");

  return (
    <Layout title={`Action - ${action.name}`}>
      <ButtonLink href={`/servers/${serverId}/actions`} variant="outline">
        Back to Actions
      </ButtonLink>

      <TabsSection />
    </Layout>
  );
};

const TabsSection = () => {
  return (
    <Tabs initialTabId="stats">
      <TabsList className="mb-6">
        <TabsTrigger tabId="stats">Statistics</TabsTrigger>
        <TabsTrigger tabId="history">Usage History</TabsTrigger>
        <TabsTrigger tabId="settings">Settings</TabsTrigger>
      </TabsList>
      <Tab tabId="stats">
        <Text variant="h3" className="text-xl font-bold mb-6">
          Action Statistics
        </Text>
        <div className="space-y-4">
          <StatItem label="Total Uses" value="1,245" />
          <StatItem label="Unique Users" value="328" />
          <StatItem label="Average Daily Uses" value="42" />
          <StatItem label="Last Used" value="2 hours ago" bordered={false} />
        </div>
      </Tab>
      <Tab tabId="history">
        <Text variant="h3" className="text-xl font-bold mb-6">
          Recent Activity
        </Text>
        <div className="space-y-4">
          {/* This would be replaced with actual data in a real implementation */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-background-300 dark:border-background-700"
            >
              <div>
                <Text variant="body" className="font-medium">User #{i}</Text>
                <Text
                  variant="body"
                  className="text-sm text-background-600 dark:text-background-300"
                >
                  {i} hour{i !== 1 ? "s" : ""} ago
                </Text>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
          ))}
        </div>
      </Tab>
      <Tab tabId="settings">
        <Text variant="h3" className="text-xl font-bold mb-6">
          Action Settings
        </Text>
        <div className="space-y-6">
          <Switch
            name="enableAction"
            initialState={true}
            label="Enable Action"
            variant="success"
          />
          <Switch
            name="requireVerification"
            initialState={false}
            label="Require Verification"
          />
          <Switch
            name="sendNotifications"
            initialState={true}
            label="Send Notifications"
            variant="success"
          />
        </div>
      </Tab>
    </Tabs>
  );
};

export const actionDetailRoute = createRoute({
  path: "/servers/:serverId/actions/:actionId",
  component: ActionDetail,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
