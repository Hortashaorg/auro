import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { Label } from "@comp/inputs/form/Label.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { SelectInput } from "@comp/inputs/form/SelectInput.tsx";
import { FormControl } from "@comp/inputs/form/FormControl.tsx";
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
        <FormControl
          inputName="name"
          hint="Enter a unique name for this item"
        >
          <Label htmlFor="item-name" required>Item Name</Label>
          <Input
            id="item-name"
            name="name"
            type="text"
            required
            placeholder="Enter item name"
          />
        </FormControl>

        <FormControl
          inputName="description"
          hint="Describe what this item does or how it can be used"
        >
          <Label htmlFor="item-description">Description</Label>
          <Textarea
            id="item-description"
            name="description"
            type="text"
            placeholder="Enter item description"
          />
        </FormControl>

        <FormControl
          inputName="rarity"
          hint="Select how rare this item is"
        >
          <Label htmlFor="item-rarity" required>Rarity</Label>
          <SelectInput
            id="item-rarity"
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
        </FormControl>

        <FormControl
          inputName="assetId"
          hint="Choose an image to represent this item"
        >
          <Label htmlFor="item-asset" required>Item Asset</Label>
          <ImageGridInput
            id="item-asset"
            name="assetId"
            assets={assets}
            required
          />
        </FormControl>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Item
      </Button>
    </Form>
  );
};
