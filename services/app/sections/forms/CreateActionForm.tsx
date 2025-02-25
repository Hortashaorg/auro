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

export const CreateActionForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  if (!serverId) throwError("No serverId");

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
    <Form
      hx-post={`/api/servers/${serverId}/create-action`}
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Choose a descriptive name for this action"
        >
          <Label htmlFor="action-name" required>Action Name</Label>
          <Input
            id="action-name"
            name="name"
            type="text"
            required
            placeholder="Enter action name"
          />
        </FormControl>

        <FormControl
          inputName="description"
          hint="Describe what this action does"
        >
          <Label htmlFor="action-description">Description</Label>
          <Textarea
            id="action-description"
            name="description"
            type="text"
            placeholder="Enter action description"
          />
        </FormControl>

        <FormControl
          inputName="assetId"
          hint="Select an image for this action"
        >
          <Label htmlFor="action-asset" required>Action Asset</Label>
          <ImageGridInput
            id="action-asset"
            name="assetId"
            assets={assets}
            required
          />
        </FormControl>

        <FormControl
          inputName="locationId"
          hint="Where this action can be performed"
        >
          <Label htmlFor="action-location">Location</Label>
          <SelectInput
            id="action-location"
            name="locationId"
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            placeholder="Select location"
          />
        </FormControl>

        <FormControl
          inputName="cooldownMinutes"
          hint="Time before action can be used again"
        >
          <Label htmlFor="action-cooldown" required>Cooldown (Minutes)</Label>
          <Input
            id="action-cooldown"
            name="cooldownMinutes"
            type="number"
            min="0"
            required
            value={0}
          />
        </FormControl>

        <FormControl
          inputName="repeatable"
          hint="Can this action be used multiple times?"
        >
          <Label htmlFor="action-repeatable" required>Repeatable</Label>
          <SelectInput
            id="action-repeatable"
            name="repeatable"
            required
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            defaultValue="true"
          />
        </FormControl>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Action
      </Button>
    </Form>
  );
};
