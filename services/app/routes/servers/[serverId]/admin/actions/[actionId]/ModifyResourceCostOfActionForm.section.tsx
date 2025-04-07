import { FormControl } from "@comp/molecules/form/index.ts";
import { Form, Input } from "@comp/atoms/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { type FC, getGlobalContext, type JSX } from "@kalena/framework";
import { IconButton } from "@comp/atoms/buttons/IconButton.tsx";

type Props = JSX.IntrinsicElements["form"];
export const ModifyResourceCostOfActionForm: FC<Props> = async (
  { ...props },
) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  const resourceCosts: {
    id: string;
    resourceId: string;
    resourceName: string;
    quantity: number;
  }[] = [];

  return (
    <Form
      {...props}
      hx-post={`/servers/${serverId}/admin/actions/${actionId}/update-costs`}
      hx-swap="none"
      id="modify-resource-cost-of-action-form"
    >
      {resourceCosts.length === 0
        ? (
          <div className="text-gray-500 italic p-4 text-center">
            No resource costs added yet. Click "Add Cost" to add one.
          </div>
        )
        : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Resource</TableCell>
                <TableCell isHeader>Quantity</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceCosts.map((resourceCost) => (
                <TableRow key={resourceCost.id} hoverable>
                  <TableCell>
                    {resourceCost.resourceName}
                  </TableCell>
                  <TableCell>
                    <FormControl
                      inputName={`resource_${resourceCost.resourceId}_quantity`}
                    >
                      <Input
                        type="number"
                        name={`resource_${resourceCost.resourceId}_quantity`}
                        value={resourceCost.quantity}
                        min={1}
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      type="button"
                      size="xs"
                      icon="trash"
                      variant="danger"
                      aria-label={`Remove ${resourceCost.resourceName}`}
                      hx-post={`/servers/${serverId}/admin/actions/${actionId}/remove-cost/${resourceCost.id}`}
                      hx-swap="none"
                      hx-confirm={`Are you sure you want to remove ${resourceCost.resourceName} cost from this action?`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
    </Form>
  );
};
