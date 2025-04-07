import { Button, ButtonGroup } from "@comp/atoms/buttons/index.ts";
import { Form, Input, Label, SelectInput } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { db, eq, schema } from "@package/database";
import { getGlobalContext, v } from "@kalena/framework";
import { Flex } from "@comp/atoms/layout/index.ts";

const formSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
  quantity: v.pipe(
    v.string(),
    v.transform((value: string) => Number(value)),
    v.number(),
    v.integer(),
    v.minValue(1),
  ),
});

export const AddResourceCostToActionForm = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");

  const resources = await db.select({
    id: schema.resource.id,
    name: schema.resource.name,
  })
    .from(schema.resource)
    .where(
      eq(schema.resource.serverId, serverId),
    )
    .orderBy(schema.resource.name);

  const resourceOptions = resources.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  return (
    <Form
      hx-post={`/servers/${serverId}/admin/actions/${
        globalContext.req.param("actionId")
      }/costs`}
      hx-swap="none"
      className="w-full"
      formValidationSchema={formSchema}
    >
      <Flex direction="col" gap="lg">
        <FormControl inputName="resourceId">
          <Label required>Resource</Label>
          <SelectInput name="resourceId" options={resourceOptions} required />
        </FormControl>
        <FormControl inputName="quantity">
          <Label required>Quantity</Label>
          <Input name="quantity" type="number" required min="1" />
        </FormControl>
        <ButtonGroup justify="end">
          <Button type="button" variant="outline" data-dismiss="modal">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Cost
          </Button>
        </ButtonGroup>
      </Flex>
    </Form>
  );
};

// Note: The actual API endpoint logic will be created in a separate file.
// This component just provides the form structure.
