import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { Label } from "@comp/inputs/form/Label.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
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
        <div>
          <Label htmlFor="location-name" required>Location Name</Label>
          <Input
            id="location-name"
            name="name"
            type="text"
            required
            placeholder="Enter location name"
          />
        </div>

        <div>
          <Label htmlFor="location-description">Description</Label>
          <Textarea
            id="location-description"
            name="description"
            type="text"
            placeholder="Enter location description"
          />
        </div>

        <div>
          <Label htmlFor="location-asset" required>Location Asset</Label>
          <ImageGridInput
            id="location-asset"
            name="assetId"
            assets={assets}
            required
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Location
      </Button>
    </Form>
  );
};
