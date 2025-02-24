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
import { ResourceGrid } from "@sections/views/ResourceGrid.tsx";

const Resources = async () => {
  const context = resourcesRoute.context();
  const serverId = context.req.param("serverId");
  const assets = await db.select().from(schema.asset).where(
    eq(schema.asset.type, "resource"),
  );

  return (
    <Layout title="Resources">
      <ModalButton modalRef="createResourceModal">
        Create Resource
      </ModalButton>
      <Modal modalRef="createResourceModal" title="Create Resource">
        <Form
          hx-post={`/api/servers/${serverId}/create-resource`}
          hx-swap="none"
        >
          <div className="space-y-4">
            <div>
              <Text variant="body" className="mb-2">Resource Name</Text>
              <Input
                name="name"
                type="text"
                required
                placeholder="Enter resource name (e.g., Wood, Iron, Gold)"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Description</Text>
              <Textarea
                name="description"
                type="text"
                placeholder="Enter resource description"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Resource Asset</Text>
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
            Create Resource
          </Button>
        </Form>
      </Modal>

      <ResourceGrid />
    </Layout>
  );
};

export const resourcesRoute = createRoute({
  path: "/servers/:serverId/resources",
  component: Resources,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
