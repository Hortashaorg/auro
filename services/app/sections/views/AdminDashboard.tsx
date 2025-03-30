import { Badge, Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import type { InferSelectModel, schema } from "@package/database";
import { Switch } from "@comp/atoms/form/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";

export const AdminDashboard = (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  return (
    <Card width="fit" id="admin-dashboard">
      <CardBody>
        <Title>Server Status</Title>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        <Switch
          name="online"
          initialState={server.online}
          hx-post={`/api/servers/${server.id}/toggle-status`}
          hx-target="#admin-dashboard"
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
