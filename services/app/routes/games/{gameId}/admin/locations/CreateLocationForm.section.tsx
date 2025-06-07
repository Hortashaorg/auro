import { FormControl } from "@comp/molecules/form/index.ts";
import { Form, Input, Label, Textarea } from "@comp/atoms/form/index.ts";
import { ImageGridInput } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { queries } from "@package/database";

export const CreateLocationForm = async ({ gameId }: { gameId: string }) => {
  const assets = await queries.assets.getAssetsByType("location");

  return (
    <Form
      hx-post={`/api/games/${gameId}/admin/locations/create-location`}
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Enter a unique name for this location"
        >
          <Label htmlFor="location-name" required>Location Name</Label>
          <Input
            id="location-name"
            name="name"
            type="text"
            required
            placeholder="Enter location name"
          />
        </FormControl>

        <FormControl
          inputName="description"
          hint="Describe this location and its features"
        >
          <Label htmlFor="location-description">Description</Label>
          <Textarea
            id="location-description"
            name="description"
            type="text"
            placeholder="Enter location description"
          />
        </FormControl>

        <FormControl
          inputName="assetId"
          hint="Choose an image to represent this location"
        >
          <Label required>Location Asset</Label>
          <ImageGridInput
            name="assetId"
            assets={assets}
            required
          />
        </FormControl>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Location
      </Button>
    </Form>
  );
};
