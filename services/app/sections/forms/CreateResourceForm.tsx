import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { ImageGridInput } from "@comp/inputs/form/ImageGridInput.tsx";
import { Label } from "@comp/inputs/form/Label.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { db, eq, schema } from "@package/database";
import { getGlobalContext } from "@kalena/framework";
import { throwError } from "@package/common";

export const CreateResourceForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  if (!serverId) throwError("No serverId");

  const assets = await db.select({
    id: schema.asset.id,
    url: schema.asset.url,
  })
    .from(schema.asset)
    .where(eq(schema.asset.type, "resource"));

  return (
    <Form
      hx-post={`/api/servers/${serverId}/create-resource`}
      hx-swap="none"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="resource-name" required>Resource Name</Label>
          <Input
            id="resource-name"
            name="name"
            type="text"
            required
            placeholder="Enter resource name (e.g., Wood, Iron, Gold)"
          />
        </div>

        <div>
          <Label htmlFor="resource-description">Description</Label>
          <Textarea
            id="resource-description"
            name="description"
            type="text"
            placeholder="Enter resource description"
          />
        </div>

        <div>
          <Label htmlFor="resource-asset" required>Resource Asset</Label>
          <ImageGridInput
            id="resource-asset"
            name="assetId"
            assets={assets}
            required
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Resource
      </Button>
    </Form>
  );
};
