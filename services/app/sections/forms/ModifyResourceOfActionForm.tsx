import { Form, FormControl, Input, Range } from "@comp/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { db, eq, schema } from "@package/database";
import { type FC, getGlobalContext, type JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];
/**
 * Form component for modifying resources of an action within a table
 *
 * Features:
 * - Renders table rows for each resource
 * - Handles resource rewards editing
 * - Provides form controls for each field
 * - Works with FormContext for state management
 */
export const ModifyResourceOfActionForm: FC<Props> = async ({ ...props }) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  const resourceRewards = await db.select({
    id: schema.actionResourceReward.id,
    resourceId: schema.resource.id,
    resourceName: schema.resource.name,
    chance: schema.actionResourceReward.chance,
    quantityMin: schema.actionResourceReward.quantityMin,
    quantityMax: schema.actionResourceReward.quantityMax,
  })
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(
      eq(schema.actionResourceReward.actionId, actionId),
    );

  return (
    <Form
      {...props}
      hx-post={`/api/servers/${serverId}/actions/${actionId}/resource-rewards/change`}
      hx-swap="none"
      id="modify-resource-of-action-form"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Resource</TableCell>
            <TableCell isHeader>Drop Rate (%)</TableCell>
            <TableCell isHeader>Min Quantity</TableCell>
            <TableCell isHeader>Max Quantity</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resourceRewards.map((resourceReward) => (
            <TableRow key={resourceReward.id} hoverable>
              <TableCell>
                {resourceReward.resourceName}
              </TableCell>
              <TableCell>
                <FormControl
                  inputName={`resource_${resourceReward.resourceId}_chance`}
                >
                  <Range
                    name={`resource_${resourceReward.resourceId}_chance`}
                    min={0}
                    max={100}
                    defaultValue={resourceReward.chance}
                    unitSuffix="%"
                  />
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl
                  inputName={`resource_${resourceReward.resourceId}_min`}
                >
                  <Input
                    type="number"
                    name={`resource_${resourceReward.resourceId}_min`}
                    value={resourceReward.quantityMin}
                    min={1}
                  />
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl
                  inputName={`resource_${resourceReward.resourceId}_max`}
                >
                  <Input
                    type="number"
                    name={`resource_${resourceReward.resourceId}_max`}
                    value={resourceReward.quantityMax}
                    min={1}
                  />
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Form>
  );
};
