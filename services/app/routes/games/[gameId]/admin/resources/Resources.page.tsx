import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ResourceGrid } from "./ResourceGrid.section.tsx";
import { CreateResourceForm } from "./CreateResourceForm.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Resources = async () => {
  const { user } = await adminResourcesRoute.customContext();

  return (
    <Layout title="Admin - Resources">
      <ModalButton modalRef="createResourceModal">
        Create Resource
      </ModalButton>
      <Modal modalRef="createResourceModal" title="Create Resource">
        <CreateResourceForm />
      </Modal>

      <ResourceGrid gameId={user.gameId} />
    </Layout>
  );
};

export const adminResourcesRoute = createRoute({
  path: "/games/:gameId/admin/resources",
  component: Resources,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
