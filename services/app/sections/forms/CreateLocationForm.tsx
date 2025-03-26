import {
  Form,
  FormControl,
  ImageGridInput,
  Input,
  Label,
  Textarea,
} from "@comp/form/index.ts";
import { Button } from "@comp/buttons/index.ts";
import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";

export const CreateLocationForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  if (!serverId) throwError("No serverId");

  const assets = await db.select({
    id: schema.asset.id,
    url: schema.asset.url,
  })
    .from(schema.asset)
    .where(eq(schema.asset.type, "location"));

  return (
    <Form
      hx-post={`/api/servers/${serverId}/create-location`}
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
          <Label htmlFor="location-asset" required>Location Asset</Label>
          <ImageGridInput
            id="location-asset"
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
