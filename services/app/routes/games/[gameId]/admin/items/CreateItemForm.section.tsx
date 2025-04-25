import { FormControl } from "@comp/molecules/form/index.ts";
import {
  Form,
  Input,
  Label,
  SelectInput,
  Textarea,
} from "@comp/atoms/form/index.ts";
import { ImageGridInput } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { selectItemAssets } from "@queries/selects/assets/selectItemAssets.ts";

export const CreateItemForm = async ({ gameId }: { gameId: string }) => {
  const assets = await selectItemAssets();

  return (
    <Form
      hx-post={`/api/games/${gameId}/admin/items/create-item`}
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
          <Label required>Item Asset</Label>
          <ImageGridInput
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
