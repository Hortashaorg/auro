import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@comp/layout/Layout.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { Text } from "@comp/content/Text.tsx";
import { db, eq, schema } from "@package/database";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { LocationGrid } from "@sections/views/LocationGrid.tsx";

const Locations = async () => {
  const context = locationsRoute.context();
  const serverId = context.req.param("serverId");
  const assets = await db.select().from(schema.asset).where(
    eq(schema.asset.type, "location"),
  );

  return (
    <Layout title="Locations">
      <ModalButton modalRef="createLocationModal">
        Create Location
      </ModalButton>
      <Modal modalRef="createLocationModal" title="Create Location">
        <Form
          hx-post={`/api/servers/${serverId}/create-location`}
          hx-swap="none"
        >
          <div className="space-y-4">
            <div>
              <Text variant="body" className="mb-2">Location Name</Text>
              <Input
                name="name"
                type="text"
                required
                placeholder="Enter location name"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Description</Text>
              <Textarea
                name="description"
                type="text"
                placeholder="Enter location description"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Location Asset</Text>
              <ImageGridInput
                name="assetId"
                assets={assets.map((asset) => ({
                  id: asset.id,
                  url: asset.url,
                }))}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Create Location
          </Button>
        </Form>
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
