import { isPlayerOfServer } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { Layout } from "@layout/Layout.tsx";
import { db, eq, schema } from "@package/database";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Card } from "@comp/atoms/card/Card.tsx";
// Import list components if available, or use simple ul/li
// Assuming List, ListItem are available from your components:
// import { List, ListItem } from "@comp/atoms/list/index.ts";

const ActionLog = async () => {
  const context = actionLogRoute.context();
  const serverId = context.req.param("serverId");

  const actionLogs = await db
    .select()
    .from(schema.actionLog)
    .where(eq(schema.actionLog.serverId, serverId))
    .orderBy(schema.actionLog.executedAt);

  // Helper function to render log data nicely
  const renderLogData = (data: any) => {
    if (!data || typeof data !== "object") {
      return <Text>No details available.</Text>;
    }

    const elements = [];

    if (data.resourceReward && data.resourceReward.length > 0) {
      elements.push(
        <div key="resourceReward" className="mt-2">
          <Text variant="strong">Resources Rewarded:</Text>
          <ul className="list-disc list-inside ml-4">
            {data.resourceReward.map((reward: any, index: number) => (
              <li key={`reward-${index}`}>
                {reward.quantity}x Resource ID: {reward.resourceId}
              </li>
            ))}
          </ul>
        </div>,
      );
    }

    if (data.resourceConsumption && data.resourceConsumption.length > 0) {
      elements.push(
        <div key="resourceConsumption" className="mt-2">
          <Text variant="strong">Resources Consumed:</Text>
          <ul className="list-disc list-inside ml-4">
            {data.resourceConsumption.map((consumed: any, index: number) => (
              <li key={`consumed-${index}`}>
                {consumed.quantity}x Resource ID: {consumed.resourceId}{" "}
                {consumed.reason ? `(${consumed.reason})` : ""}
              </li>
            ))}
          </ul>
        </div>,
      );
    }

    if (data.itemReward && data.itemReward.length > 0) {
      elements.push(
        <div key="itemReward" className="mt-2">
          <Text variant="strong">Items Rewarded:</Text>
          <ul className="list-disc list-inside ml-4">
            {data.itemReward.map((item: any, index: number) => (
              <li key={`item-${index}`}>
                {item.quantity}x Item ID: {item.itemId}
              </li>
            ))}
          </ul>
        </div>,
      );
    }

    // Add rendering for other keys like enchantResult, skillXp, etc. here

    if (elements.length === 0) {
      return <Text>No specific details logged for this action.</Text>;
    }

    return <>{elements}</>;
  };

  return (
    <Layout title="Action Log">
      <Title level="h1">Action Log</Title>
      {actionLogs.map((log) => (
        <Card key={log.id} className="mb-4 p-4">
          {/* Added padding */}
          <Text variant="strong">Action ID:</Text> {log.actionId}
          <br />
          <Text variant="strong">Executed At:</Text>{" "}
          {log.executedAt?.toString()}
          <br />
          <Text variant="strong">Details:</Text>
          {/* Replace pre block with the rendering function call */}
          <div className="mt-1">
            {renderLogData(log.data)}
          </div>
        </Card>
      ))}
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
