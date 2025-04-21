import { getGlobalContext } from "@kalena/framework";
import { db, eq, schema } from "@package/database";
import { Form, Label, SelectInput } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";

export const AddResourceToActionForm = async () => {
  const globalContext = getGlobalContext();
  const gameId = globalContext.req.param("gameId");
  const actionId = globalContext.req.param("actionId");

  const availableResources = await db.select().from(schema.resource).where(
    eq(schema.resource.gameId, gameId),
  );

  const resourceOptions = availableResources.map((resource) => ({
    value: resource.id,
    label: resource.name,
  }));

  return (
    <Form
      hx-post={`/api/games/${gameId}/admin/actions/${actionId}/add-resource-rewards`}
      hx-swap="none"
    >
      <Flex direction="col" gap="lg">
        <FormControl inputName="resourceId">
          <Label required>Select a resource</Label>
          <SelectInput
            name="resourceId"
            options={resourceOptions}
            required
          />
        </FormControl>

        <Button type="submit" variant="primary">
          Add resource
        </Button>
      </Flex>
    </Form>
  );
};
