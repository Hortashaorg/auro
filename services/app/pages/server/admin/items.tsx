import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ItemGrid } from "@sections/views/ItemGrid.tsx";
import { CreateItemForm } from "@sections/forms/CreateItemForm.tsx";

const Items = () => {
  return (
    <Layout title="Admin - Items">
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
