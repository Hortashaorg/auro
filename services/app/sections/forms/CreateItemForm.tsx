import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { SelectInput } from "@comp/inputs/form/SelectInput.tsx";
import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";

export const CreateItemForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  if (!serverId) throwError("No serverId");

  const assets = await db.select({
    id: schema.asset.id,
    url: schema.asset.url,
  })
    .from(schema.asset)
    .where(eq(schema.asset.type, "item"));

  return (
    <Form
      hx-post={`/api/servers/${serverId}/create-item`}
      hx-swap="none"
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
            type="text"
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
            assets={assets}
            required
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Item
      </Button>
    </Form>
  );
};
