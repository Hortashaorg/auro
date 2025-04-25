import { isPlayerOfGame } from "@permissions/index.ts";
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
import { userContext } from "@contexts/userContext.ts";
import { selectResourcesByGameId } from "@queries/selects/resources/selectResourcesByGameId.ts";
import { selectActionLogsByUserId } from "@queries/selects/actions/selectActionLogsByUserId.ts";

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
  const { user, game } = await actionLogRoute.customContext();

  const actionLogsData = await selectActionLogsByUserId(user.id);

  const resources = await selectResourcesByGameId(game.id);

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
                  <TableCell isHeader className="w-1/3">
                    Name
                  </TableCell>
                  <TableCell isHeader className="w-1/3">
                    Type
                  </TableCell>
                  <TableCell isHeader className="w-1/3">
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
                      <TableCell>
                        <Badge
                          variant={resource.type === "reward"
                            ? "success"
                            : "danger"}
                        >
                          {resource.type === "reward" ? "Reward" : "Cost"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text
                          variant={resource.type === "reward"
                            ? "body"
                            : "error"}
                        >
                          {resource.type === "reward" ? "+" : "-"}
                          {Math.abs(resource.amount)}
                        </Text>
                      </TableCell>
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
  path: "/games/:gameId/action-log",
  component: ActionLog,
  permission: {
    check: isPlayerOfGame,
    redirectPath: "/games",
  },
  customContext: userContext,
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
