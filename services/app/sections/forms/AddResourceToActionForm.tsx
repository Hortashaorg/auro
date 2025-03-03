import { Form } from "@comp/inputs/form/Form.tsx";
import { getGlobalContext } from "@kalena/framework";
import { db, eq, schema } from "@package/database";
import { RadioGroup } from "@comp/inputs/form/RadioGroup.tsx";
import { Button } from "@comp/inputs/Button.tsx";

export const AddResourceToActionForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  const availableResources = await db.select().from(schema.resource).where(
    eq(schema.resource.serverId, serverId),
  );

  return (
    <Form
      hx-post={`/api/servers/${serverId}/actions/${actionId}/resources/add`}
    >
      <RadioGroup
        name="resource"
        options={availableResources.map((resource) => ({
          label: resource.name,
          value: resource.id,
        }))}
      />

      <Button type="submit" variant="primary" className="mt-4">
        Add resource
      </Button>
    </Form>
  );
};
