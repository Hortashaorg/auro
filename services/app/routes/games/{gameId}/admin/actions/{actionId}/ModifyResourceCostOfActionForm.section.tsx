import { FormControl } from "@comp/molecules/form/index.ts";
import { Form, Input } from "@comp/atoms/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { queries } from "@package/database";
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
  const gameId = globalContext.req.param("gameId");
  const actionId = globalContext.req.param("actionId");

  const resourceCosts = await queries.actions.getResourceCostsByActionId(
    actionId,
  );

  return (
    <>
      <Form
        {...props}
        hx-post={`/games/${gameId}/admin/actions/${actionId}/update-costs`}
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
                    <TableRow key={resourceCost.resource.id} hoverable>
                      <TableCell>
                        {resourceCost.resource.name}
                      </TableCell>
                      <TableCell>
                        <FormControl
                          inputName={`resource_${resourceCost.resource.id}_quantity`}
                        >
                          <Input
                            type="number"
                            name={`resource_${resourceCost.resource.id}_quantity`}
                            value={resourceCost.action_resource_cost.quantity}
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
                          title={`Delete ${resourceCost.resource.name}`}
                        >
                          <DeleteConfirmation
                            itemName={resourceCost.resource.name}
                            itemType="Cost"
                            deleteEndpoint={`/games/${gameId}/admin/actions/${actionId}/remove-cost/${resourceCost.resource.id}`}
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
