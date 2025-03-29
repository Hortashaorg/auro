import { getGlobalContext } from "@kalena/framework";
import { db, eq, schema } from "@package/database";
import { Form } from "@comp/atoms/form/index.ts";
import { RadioGroup } from "@comp/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";

export const AddResourceToActionForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  const availableResources = await db.select().from(schema.resource).where(
    eq(schema.resource.serverId, serverId),
  );

  return (
    <Form
      hx-post={`/api/servers/${serverId}/actions/${actionId}/resource-rewards/add`}
      hx-swap="none"
    >
      <RadioGroup
        name="resourceId"
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
