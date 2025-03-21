import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { ModalButton } from "@comp/display/modal/ModalButton.tsx";
import { Modal } from "@comp/display/modal/Modal.tsx";
import { LocationGrid } from "@sections/views/LocationGrid.tsx";
import { CreateLocationForm } from "@sections/forms/CreateLocationForm.tsx";

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
  path: "/servers/:serverId/locations",
  component: Locations,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
