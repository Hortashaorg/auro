import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { GameGrid } from "./GameGrid.section.tsx";
import { createRoute } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { CreateGameForm } from "./CreateGameForm.section.tsx";
import { accountContext } from "@contexts/accountContext.ts";

const Games = async () => {
  const account = await gamesRoute.customContext();
  const canCreateGame = account?.canCreateGame ?? false;

  return (
    <Layout title="Game Selection">
      {canCreateGame && (
        <>
          <ModalButton modalRef="createGameModal" className="mb-4">
            Create Game
          </ModalButton>

          <Modal title="Create New Game" modalRef="createGameModal">
            <CreateGameForm />
          </Modal>
        </>
      )}

      <GameGrid />
    </Layout>
  );
};

export const gamesRoute = createRoute({
  path: "/games",
  component: Games,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: accountContext,
});
