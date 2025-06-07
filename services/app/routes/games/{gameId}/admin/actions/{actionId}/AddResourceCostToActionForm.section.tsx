import { Button, ButtonGroup } from "@comp/atoms/buttons/index.ts";
import { Form, Label, SelectInput } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { getGlobalContext, v } from "@kalena/framework";
import { Flex } from "@comp/atoms/layout/index.ts";
import { queries } from "@package/database";

const formSchema = v.object({
  resourceId: v.pipe(v.string(), v.uuid()),
});

export const AddResourceCostToActionForm = async () => {
  const globalContext = getGlobalContext();
  const gameId = globalContext.req.param("gameId");

  const resources = await queries.resources.getResourcesByGameId(gameId);
  const resourceOptions = resources.map((data) => ({
    value: data.resource.id,
    label: data.resource.name,
  }));

  return (
    <Form
      hx-post={`/games/${gameId}/admin/actions/${
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
