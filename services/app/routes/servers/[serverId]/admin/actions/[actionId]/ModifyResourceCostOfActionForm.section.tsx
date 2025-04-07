import { FormControl } from "@comp/molecules/form/index.ts";
import { Form, Input } from "@comp/atoms/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { db, eq, schema } from "@package/database";
import { type FC, getGlobalContext, type JSX } from "@kalena/framework";
import { ModalButton } from "@comp/molecules/modal/index.ts";
import { Modal } from "@comp/molecules/modal/index.ts";
import { DeleteConfirmation } from "./DeleteConfirmation.section.tsx";
import { Text } from "@comp/atoms/typography/index.ts";

type Props = JSX.IntrinsicElements["form"];

export const ModifyResourceCostOfActionForm: FC<Props> = async (
  { ...props },
) => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  const resourceCosts = await db.select({
    id: schema.actionResourceCost.id,
    resourceId: schema.resource.id,
    resourceName: schema.resource.name,
    quantity: schema.actionResourceCost.quantity,
  })
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .where(
      eq(schema.actionResourceCost.actionId, actionId),
    );

  return (
    <>
      <Form
        {...props}
        hx-post={`/servers/${serverId}/admin/actions/${actionId}/update-costs`}
        hx-swap="none"
        id="modify-resource-cost-of-action-form"
      >
        {resourceCosts.length === 0
          ? (
            <Text variant="body">
              No resource costs added yet. Click "Add Cost" to add one.
            </Text>
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
                {resourceCosts.map((resourceCost, index) => {
                  const modalRef = `deleteCost${index}`;
                  return (
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
                        <ModalButton
                          size="xs"
                          variant="danger"
                          modalRef={modalRef}
                        >
                          Delete
                        </ModalButton>
                        <Modal
                          modalRef={modalRef}
                          title={`Delete ${resourceCost.resourceName}`}
                        >
                          <DeleteConfirmation
                            itemName={resourceCost.resourceName}
                            itemType="Cost"
                            deleteEndpoint={`/servers/${serverId}/admin/actions/${actionId}/remove-cost/${resourceCost.id}`}
                          />
                        </Modal>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
      </Form>
    </>
  );
};
