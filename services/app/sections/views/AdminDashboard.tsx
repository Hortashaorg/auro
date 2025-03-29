import { Badge, Text } from "@comp/atoms/typography/index.ts";
import type { InferSelectModel, schema } from "@package/database";
import { Switch } from "@comp/form/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";

export const AdminDashboard = (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  return (
    <Card width="fit" id="admin-dashboard">
      <CardBody>
        <Text variant="h3">Server Status</Text>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={server.online ? "success" : "danger"}
              className="flex items-center gap-1"
            >
              {server.online
                ? (
                  <>
                    <i data-lucide="server" width={16} height={16}></i>
                    Online
                  </>
                )
                : (
                  <>
                    <i data-lucide="server-off" width={16} height={16}></i>
                    Offline
                  </>
                )}
            </Badge>
            <Text
              variant="span"
              className="text-sm text-on-surface-variant dark:text-on-surface-dark-variant"
            >
              {server.online
                ? "Server is currently running and accessible to players"
                : "Server is currently offline and inaccessible to players"}
            </Text>
          </div>
        </div>
        <Switch
          initialState={server.online}
          hx-post={`/api/servers/${server.id}/toggle-status`}
          hx-target="#admin-dashboard"
          hx-swap="outerHTML"
          variant={server.online ? "success" : "danger"}
          label={server.online ? "Enabled" : "Disabled"}
        />
        <div className="text-xs text-on-surface-variant dark:text-on-surface-dark-variant italic">
          Toggle the switch to {server.online ? "disable" : "enable"} the server
        </div>
      </CardBody>
    </Card>
  );
};
