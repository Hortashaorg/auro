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
import { ItemGrid } from "@sections/views/ItemGrid.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { db, schema } from "@package/database";

const Items = async () => {
  const context = itemsRoute.context();
  const serverId = context.req.param("serverId");

  const assets = await db.select().from(schema.asset);

  return (
    <Layout title="Items">
      <ModalButton modalRef="createItemModal">
        Create Item
      </ModalButton>

      <Modal modalRef="createItemModal" title="Create Item">
        <Form
          hx-post={`/api/servers/${serverId}/create-item`}
          hx-swap="none"
          hx-target="#item-section"
        >
          <div className="space-y-4">
            <div>
              <Text variant="body" className="mb-2">Item Name</Text>
              <Input
                name="name"
                type="text"
                required
                placeholder="Enter item name"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Description</Text>
              <Textarea
                name="description"
                placeholder="Enter item description"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Rarity</Text>
              <SelectInput
                name="rarity"
                required
                options={[
                  { value: "common", label: "Common" },
                  { value: "uncommon", label: "Uncommon" },
                  { value: "rare", label: "Rare" },
                  { value: "epic", label: "Epic" },
                  { value: "legendary", label: "Legendary" },
                ]}
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Item Asset</Text>
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
            Create Item
          </Button>
        </Form>
      </Modal>

      <ItemGrid />
    </Layout>
  );
};

export const itemsRoute = createRoute({
  path: "/servers/:serverId/items",
  component: Items,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
