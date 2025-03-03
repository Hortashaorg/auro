import { Form } from "@comp/inputs/form/Form.tsx";
import { FormControl } from "@comp/inputs/form/FormControl.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Range } from "@comp/inputs/form/Range.tsx";
import { TableRow } from "@comp/data/TableRow.tsx";
import { TableCell } from "@comp/data/TableCell.tsx";
import { db, eq, schema } from "@package/database";
import { type FC, getGlobalContext, type JSX } from "@kalena/framework";
import { Table } from "@comp/data/Table.tsx";
import { TableHeader } from "@comp/data/TableHeader.tsx";
import { TableBody } from "@comp/data/TableBody.tsx";

type Props = JSX.IntrinsicElements["form"];
/**
 * Form component for modifying resources of an action within a table
 *
 * Features:
 * - Renders table rows for each resource
 * - Handles resource rewards editing
 * - Provides form controls for each field
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
      id="modify-resource-of-action-form"
      x-on:input="$dispatch('form-change'); formIsDirty = true"
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
                    defaultValue={resourceReward.quantityMin}
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
                    defaultValue={resourceReward.quantityMax}
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
