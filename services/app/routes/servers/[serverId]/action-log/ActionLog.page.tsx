import { isPlayerOfServer } from "@permissions/index.ts";
import { createRoute } from "@kalena/framework";
import { Layout } from "@layout/Layout.tsx";
import { db, desc, eq, schema } from "@package/database";
import { Badge, Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { MediaCardHeader } from "@comp/molecules/card/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { throwError } from "@package/common";

const calculateDuration = (executedAt: Temporal.Instant) => {
  const duration = executedAt.until(
    Temporal.Now.instant(),
  );
  if (duration.seconds < 10) {
    return `Now`;
  }
  if (duration.seconds < 60) {
    return `Less than a minute ago`;
  }
  const minutes = Math.floor(duration.seconds / 60);
  if (minutes === 1) {
    return "One minute ago";
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours === 1) {
    return "One hour ago";
  }
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const ActionLog = async () => {
  const context = actionLogRoute.context();
  const serverId = context.req.param("serverId");

  const actionLogsData = await db
    .select()
    .from(schema.actionLog)
    .innerJoin(schema.action, eq(schema.actionLog.actionId, schema.action.id))
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .innerJoin(
      schema.location,
      eq(schema.action.locationId, schema.location.id),
    )
    .where(eq(schema.actionLog.serverId, serverId))
    .orderBy(desc(schema.actionLog.executedAt));

  const resources = await db
    .select()
    .from(schema.resource)
    .where(eq(schema.resource.serverId, serverId));

  return (
    <Layout title="Action Log">
      <Title level="h1">Action Log</Title>
      {actionLogsData.length === 0 && (
        <Card>
          <CardBody>
            <Text>
              No action logs found. Complete actions to see them here.
            </Text>
          </CardBody>
        </Card>
      )}
      {actionLogsData.map((log) => {
        return (
          <Card key={log.action_log.id}>
            <MediaCardHeader
              title={log.action.name}
              description={log.action.description ?? ""}
              imageSrc={log.asset.url}
              imageAlt={log.asset.name}
            />
            <CardBody>
              <Flex>
                <Badge variant="info" className="flex items-center gap-2">
                  <Icon icon="clock" variant="none" />
                  {calculateDuration(log.action_log.executedAt)}
                </Badge>
                <Badge variant="inverse" className="flex items-center gap-2">
                  <Icon icon="map-pin" variant="none" />
                  {log.location.name}
                </Badge>
              </Flex>

              <Title level="h2">Resources</Title>
              <Table>
                <TableHeader>
                  <TableCell isHeader>
                    Name
                  </TableCell>
                  <TableCell isHeader>
                    Amount
                  </TableCell>
                </TableHeader>
                {log.action_log.data.resource.map((resource) => {
                  const resourceData = resources.find(
                    (r) => r.id === resource.resourceId,
                  ) ?? throwError("Resource not found");
                  return (
                    <TableRow key={resource.resourceId}>
                      <TableCell>{resourceData.name}</TableCell>
                      <TableCell>{resource.amount}</TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </CardBody>
          </Card>
        );
      })}
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
