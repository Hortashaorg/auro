import { Layout } from "@comp/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";
import { throwError } from "@package/common";
import { hasAccessToServer } from "@permissions/index.ts";
import { serverAndUser } from "@queries/serverAndUser.ts";
import type { InferSelectModel, schema } from "@package/database";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Button } from "@comp/inputs/Button.tsx";

const AdminDashboard = (
  { server }: { server: InferSelectModel<typeof schema.server> },
) => {
  const context = serverRoute.context();
  const serverId = context.req.param("serverId");

  return (
    <>
      <Text variant="h2">Server Status</Text>
      <ModalButton modalRef="createLocationModal">
        Create Location
      </ModalButton>
      <Modal modalRef="createLocationModal" title="Create Location">
        <Form
          hx-post={`/api/servers/${serverId}/create-location`}
          hx-swap="none"
        >
          <div>
            <Text variant="body" className="mb-2">Location Name</Text>
            <Input
              name="name"
              type="text"
              required
              minLength={3}
              maxLength={50}
              placeholder="Enter location name"
            />
          </div>

          <Button type="submit" variant="primary">
            Create Server
          </Button>
        </Form>
      </Modal>
      <Text>Status: {server.online ? "Online" : "Offline"}</Text>
    </>
  );
};

const PlayerDashboard = () => {
  return (
    <>
      <Text>Welcome to the server</Text>
    </>
  );
};

const Server = async () => {
  const context = await serverRoute.customContext();
  const server = context.server;
  const user = context.user;

  return (
    <Layout title={server.name}>
      <Text variant="h1" className="mb-8">{server.name}</Text>
      {user.type === "admin"
        ? <AdminDashboard server={server} />
        : <PlayerDashboard />}
    </Layout>
  );
};

export const serverRoute = createRoute({
  path: "/servers/:serverId",
  component: Server,
  permission: {
    check: hasAccessToServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: (c) => {
    const serverId = c.req.param("serverId");
    const email = c.var.email ?? throwError("Email not found");

    return serverAndUser(serverId, email);
  },
});
