import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@comp/layout/Layout.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { SelectInput } from "@comp/inputs/form/SelectInput.tsx";
import { ActionGrid } from "@sections/views/ActionGrid.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { db, eq, schema } from "@package/database";

const Actions = async () => {
  const context = actionsRoute.context();
  const serverId = context.req.param("serverId");

  const [assets, locations] = await Promise.all([
    db.select({
      id: schema.asset.id,
      url: schema.asset.url,
    })
      .from(schema.asset)
      .where(eq(schema.asset.type, "action")),
    db.select({
      id: schema.location.id,
      name: schema.location.name,
    })
      .from(schema.location)
      .where(eq(schema.location.serverId, serverId)),
  ]);

  return (
    <Layout title="Actions">
      <ModalButton modalRef="createActionModal">
        Create Action
      </ModalButton>
      <Modal modalRef="createActionModal" title="Create Action">
        <Form
          hx-post={`/api/servers/${serverId}/create-action`}
          hx-swap="none"
        >
          <div className="space-y-4">
            <div>
              <Text variant="body" className="mb-2">Action Name</Text>
              <Input
                name="name"
                type="text"
                required
                placeholder="Enter action name (e.g., Fishing, Mining, Smelting)"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Description</Text>
              <Textarea
                name="description"
                type="text"
                placeholder="Enter action description"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Action Asset</Text>
              <ImageGridInput
                name="assetId"
                assets={assets.map((asset) => ({
                  id: asset.id,
                  url: asset.url,
                }))}
                required
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Location (Optional)</Text>
              <SelectInput
                name="locationId"
                options={locations.map((location) => ({
                  value: location.id,
                  label: location.name,
                }))}
                placeholder="Select location"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Cooldown (Minutes)</Text>
              <Input
                name="cooldownMinutes"
                type="number"
                min="0"
                required
                defaultValue="0"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Repeatable</Text>
              <SelectInput
                name="repeatable"
                required
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                defaultValue="true"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Create Action
          </Button>
        </Form>
      </Modal>
      <ActionGrid />
    </Layout>
  );
};

export const actionsRoute = createRoute({
  path: "/servers/:serverId/actions",
  component: Actions,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
