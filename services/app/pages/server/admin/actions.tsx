import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ActionGrid } from "@sections/views/ActionGrid.tsx";
import { CreateActionForm } from "@sections/forms/CreateActionForm.tsx";

const Actions = () => {
  return (
    <Layout title="Actions">
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
  path: "/servers/:serverId/actions",
  component: Actions,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
