import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ItemGrid } from "./ItemGrid.section.tsx";
import { CreateItemForm } from "./CreateItemForm.section.tsx";

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
  path: "/servers/:serverId/admin/items",
  component: Items,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
