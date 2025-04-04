import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ActionGrid } from "./ActionGrid.section.tsx";
import { CreateActionForm } from "./CreateActionForm.section.tsx";

const Actions = () => {
  return (
    <Layout title="Admin - Actions">
      <ModalButton modalRef="createActionModal">
        Create Action
      </ModalButton>
      <Modal modalRef="createActionModal" title="Create Action">
        <CreateActionForm />
      </Modal>

      <ActionGrid />
    </Layout>
  );
};

export const actionsRoute = createRoute({
  path: "/servers/:serverId/admin/actions",
  component: Actions,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
