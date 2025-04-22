import { createRoute } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { LocationGrid } from "./LocationGrid.section.tsx";
import { CreateLocationForm } from "./CreateLocationForm.section.tsx";
import { userContext } from "@contexts/userContext.ts";

const Locations = async () => {
  const { user } = await locationsRoute.customContext();

  return (
    <Layout title="Admin - Locations">
      <ModalButton modalRef="createLocationModal">
        Create Location
      </ModalButton>
      <Modal modalRef="createLocationModal" title="Create Location">
        <CreateLocationForm gameId={user.gameId} />
      </Modal>

      <LocationGrid gameId={user.gameId} />
    </Layout>
  );
};

export const locationsRoute = createRoute({
  path: "/games/:gameId/admin/locations",
  component: Locations,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: userContext,
});
