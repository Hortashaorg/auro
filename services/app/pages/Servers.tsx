import { Layout } from "@comp/layout/Layout.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";
import { db } from "@package/database";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Button } from "@comp/inputs/Button.tsx";

const Servers = async () => {
  const customContext = await serversRoute.customContext();
  const canCreateServer = customContext.account?.canCreateServer ?? false;

  return (
    <Layout title="Select Server">
      {canCreateServer && (
        <>
          <ModalButton modalRef="createServerModal" className="mb-4">
            Create Server
          </ModalButton>

          <Modal title="Create New Server" modalRef="createServerModal">
            <Form
              hx-post="/api/create-server"
              hx-swap="none"
            >
              <div>
                <Text variant="body" className="mb-2">Server Name</Text>
                <Input
                  name="name"
                  type="text"
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Enter server name"
                />
              </div>

              <Button type="submit" variant="primary">
                Create Server
              </Button>
            </Form>
          </Modal>
        </>
      )}

      <ServerGrid />
    </Layout>
  );
};

export const serversRoute = createRoute({
  path: "/servers",
  component: Servers,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: async (c) => {
    let account;
    const email = c.var.email;
    if (email) {
      account = await db.query.account.findFirst({
        where: (account, { eq }) => eq(account.email, email),
      });
    }
    return { account };
  },
});
