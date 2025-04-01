import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { LocationGrid } from "./LocationGrid.section.tsx";
import { CreateLocationForm } from "./CreateLocationForm.section.tsx";

const Locations = () => {
  return (
    <Layout title="Admin - Locations">
      <ModalButton modalRef="createLocationModal">
        Create Location
      </ModalButton>
      <Modal modalRef="createLocationModal" title="Create Location">
        <CreateLocationForm />
      </Modal>

      <LocationGrid />
    </Layout>
  );
};

export const locationsRoute = createRoute({
  path: "/servers/:serverId/admin/locations",
  component: Locations,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
