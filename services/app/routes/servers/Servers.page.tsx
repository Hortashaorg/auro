import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ServerGrid } from "./ServerGrid.section.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { db } from "@package/database";
import { CreateServerForm } from "./CreateServerForm.section.tsx";

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
