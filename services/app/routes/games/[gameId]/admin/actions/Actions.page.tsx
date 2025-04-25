import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { ActionGrid } from "./ActionGrid.section.tsx";
import { CreateActionForm } from "./CreateActionForm.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Actions = async () => {
  const { user } = await actionsRoute.customContext();

  return (
    <Layout title="Admin - Actions">
      <ModalButton modalRef="createActionModal">
        Create Action
      </ModalButton>
      <Modal modalRef="createActionModal" title="Create Action">
        <CreateActionForm
          gameId={user.gameId}
        />
      </Modal>

      <ActionGrid gameId={user.gameId} />
    </Layout>
  );
};

export const actionsRoute = createRoute({
  path: "/games/:gameId/admin/actions",
  component: Actions,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
