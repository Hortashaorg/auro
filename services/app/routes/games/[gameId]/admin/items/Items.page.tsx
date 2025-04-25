import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ItemGrid } from "./ItemGrid.section.tsx";
import { CreateItemForm } from "./CreateItemForm.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Items = async () => {
  const { user } = await itemsRoute.customContext();

  return (
    <Layout title="Admin - Items">
      <ModalButton modalRef="createItemModal">
        Create Item
      </ModalButton>
      <Modal modalRef="createItemModal" title="Create Item">
        <CreateItemForm gameId={user.gameId} />
      </Modal>

      <ItemGrid gameId={user.gameId} />
    </Layout>
  );
};

export const itemsRoute = createRoute({
  path: "/games/:gameId/admin/items",
  component: Items,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
