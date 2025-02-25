import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@comp/layout/Layout.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ItemGrid } from "@sections/views/ItemGrid.tsx";
import { CreateItemForm } from "@sections/forms/CreateItemForm.tsx";

const Items = () => {
  return (
    <Layout title="Items">
      <ModalButton modalRef="createItemModal">
        Create Item
      </ModalButton>
      <Modal modalRef="createItemModal" title="Create Item">
        <CreateItemForm />
      </Modal>

      <ItemGrid />
    </Layout>
  );
};

export const itemsRoute = createRoute({
  path: "/servers/:serverId/items",
  component: Items,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
