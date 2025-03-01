import { Layout } from "@sections/layout/Layout.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { ServerGrid } from "@sections/views/ServerGrid.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { db } from "@package/database";
import { CreateServerForm } from "@sections/forms/CreateServerForm.tsx";

const Servers = async () => {
  const customContext = await serversRoute.customContext();
  const canCreateServer = customContext.account?.canCreateServer ?? false;

  return (
    <Layout title="Server Selection">
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

      <ServerGrid />
    </Layout>
  );
};

export const serversRoute = createRoute({
  path: "/servers",
  component: Servers,
  permission: {
    check: isLoggedIn,
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
