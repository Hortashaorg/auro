import { createRoute } from "@kalena/framework";
import { db, schema } from "@package/database";
import { eq } from "@package/database";
import { throwError } from "@package/common";
import { isAdminOfServer } from "@permissions/index.ts";
import { Switch } from "@comp/inputs/Switch.tsx";

/**
 * API endpoint to toggle a server's online status
 * Only administrators can toggle server status
 */
const ToggleServerStatus = async () => {
  const context = toggleServerStatusRoute.context();
  const serverId = context.req.param("serverId");

  // Get current server status
  const server = await db.query.server.findFirst({
    where: eq(schema.server.id, serverId),
    columns: {
      id: true,
      online: true,
    },
  }) ?? throwError("Server not found");

  // Toggle the status
  const updatedServer = await db
    .update(schema.server)
    .set({ online: !server.online })
    .where(eq(schema.server.id, serverId))
    .returning({ id: schema.server.id, online: schema.server.online });

  const serverData = updatedServer[0] ??
    throwError("Failed to update server status");

  return (
    <Switch
      initialState={serverData.online}
      hx-trigger="click"
      hx-post={`/api/servers/${server.id}/toggle-status`}
    />
  );
};

export const toggleServerStatusRoute = createRoute({
  path: "/api/servers/:serverId/toggle-status",
  component: ToggleServerStatus,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
