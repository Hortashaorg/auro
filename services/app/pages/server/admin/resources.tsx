import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ResourceGrid } from "@sections/views/ResourceGrid.tsx";
import { CreateResourceForm } from "@sections/forms/CreateResourceForm.tsx";

const Resources = () => {
  return (
    <Layout title="Admin - Resources">
      <ModalButton modalRef="createResourceModal">
        Create Resource
      </ModalButton>
      <Modal modalRef="createResourceModal" title="Create Resource">
        <CreateResourceForm />
      </Modal>

      <ResourceGrid />
    </Layout>
  );
};

export const resourcesRoute = createRoute({
  path: "/servers/:serverId/resources",
  component: Resources,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
