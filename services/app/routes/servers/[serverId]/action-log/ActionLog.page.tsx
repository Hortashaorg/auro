import { isPlayerOfServer } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { Layout } from "@layout/Layout.tsx";
import { db, eq, schema } from "@package/database";
import { Text, Title } from "@comp/atoms/typography/index.ts";

const ActionLog = async () => {
  const context = actionLogRoute.context();
  const serverId = context.req.param("serverId");

  const actionLogs = await db.select().from(schema.actionLog).where(
    eq(schema.actionLog.serverId, serverId),
  );

  return (
    <Layout title="Action Log">
      <Title level="h1">Action Log</Title>
      {actionLogs.map((log) => <Text key={log.id}>{log.actionId}</Text>)}
    </Layout>
  );
};

export const actionLogRoute = createRoute({
  path: "/servers/:serverId/action-log",
  component: ActionLog,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
