import { Layout } from "@layouts/Layout.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { CreateServerForm } from "@sections/forms/CreateServerForm.tsx";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";
import { db } from "@package/database";

const Servers = async () => {
  const context = await serversRoute.customContext();
  const canCreateServer = context.account?.canCreateServer ?? false;

  // Fetch all servers
  const servers = await db.query.server.findMany({
    orderBy: (server, { desc }) => [desc(server.updatedAt)],
  });

  return (
    <Layout title="Select Server">
      {canCreateServer && (
        <>
          <ModalButton modalRef="createServerModal" className="mb-4">
            Create Server
          </ModalButton>

          <Modal title="Create New Server" modalRef="createServerModal">
            <CreateServerForm />
          </Modal>
        </>
      )}

      <ServerGrid servers={servers} />
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
