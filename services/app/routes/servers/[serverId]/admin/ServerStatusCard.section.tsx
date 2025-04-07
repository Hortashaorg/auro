import { Badge, Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import { Switch } from "@comp/atoms/form/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import type { InferSelectModel, schema } from "@package/database";
import { Flex } from "@comp/atoms/layout/index.ts";

export const ServerStatusCard = (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  return (
    <Card width="fit" id="server-status">
      <CardBody>
        <Title>Server Status</Title>
        <Flex>
          <Badge
            variant={server.online ? "success" : "danger"}
            className="flex items-center gap-1"
          >
            {server.online
              ? (
                <>
                  <Icon icon="server" variant="none" />
                  Online
                </>
              )
              : (
                <>
                  <Icon icon="server-off" variant="none" />
                  Offline
                </>
              )}
          </Badge>
          <Text
            variant="body"
            size="sm"
            as="span"
          >
            {server.online
              ? "Server is currently running and accessible to players"
              : "Server is currently offline and inaccessible to players"}
          </Text>
        </Flex>
        <Switch
          name="online"
          initialState={server.online}
          hx-post={`/api/servers/${server.id}/admin/toggle-server-status`}
          hx-target="#server-status"
          hx-swap="outerHTML"
          variant={server.online ? "success" : "danger"}
          label={server.online ? "Enabled" : "Disabled"}
        />
        <Text
          variant="body"
          size="sm"
        >
          Toggle the switch to {server.online ? "disable" : "enable"} the server
        </Text>
      </CardBody>
    </Card>
  );
};
