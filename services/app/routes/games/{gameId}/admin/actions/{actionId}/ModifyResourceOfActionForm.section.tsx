import { FormControl } from "@comp/molecules/form/index.ts";
import { Form, Input, Range } from "@comp/atoms/form/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { selectResourceRewardsByActionId } from "@queries/selects/actions/selectResourceRewardsByActionId.ts";
import { type FC, getGlobalContext, type JSX } from "@kalena/framework";
import { ModalButton } from "@comp/molecules/modal/index.ts";
import { Modal } from "@comp/molecules/modal/index.ts";
import { DeleteConfirmation } from "./DeleteConfirmation.section.tsx";
import { Text } from "@comp/atoms/typography/index.ts";

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
  const gameId = globalContext.req.param("gameId");
  const actionId = globalContext.req.param("actionId");

  const resourceRewards = await selectResourceRewardsByActionId(actionId);

  return (
    <>
      <Form
        {...props}
        hx-post={`/api/games/${gameId}/admin/actions/${actionId}/change-resource-rewards`}
        hx-swap="none"
        id="modify-resource-reward-of-action-form"
      >
        {resourceRewards.length === 0
          ? (
            <Text variant="body">
              No resource rewards added yet. Click "Add Reward" to add one.
            </Text>
          )
          : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Resource</TableCell>
                  <TableCell isHeader>Drop Rate (%)</TableCell>
                  <TableCell isHeader>Min Quantity</TableCell>
                  <TableCell isHeader>Max Quantity</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourceRewards.map((resourceReward, index) => {
                  const modalRef = `deleteReward${index}`;
                  return (
                    <TableRow key={resourceReward.resource.id} hoverable>
                      <TableCell>
                        {resourceReward.resource.name}
                      </TableCell>
                      <TableCell>
                        <FormControl
                          inputName={`resource_${resourceReward.resource.id}_chance`}
                        >
                          <Range
                            name={`resource_${resourceReward.resource.id}_chance`}
                            min={0}
                            max={100}
                            defaultValue={resourceReward.action_resource_reward
                              .chance}
                            unitSuffix="%"
                          />
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl
                          inputName={`resource_${resourceReward.resource.id}_min`}
                        >
                          <Input
                            type="number"
                            name={`resource_${resourceReward.resource.id}_min`}
                            value={resourceReward.action_resource_reward
                              .quantityMin}
                            min={1}
                          />
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <FormControl
                          inputName={`resource_${resourceReward.resource.id}_max`}
                        >
                          <Input
                            type="number"
                            name={`resource_${resourceReward.resource.id}_max`}
                            value={resourceReward.action_resource_reward
                              .quantityMax}
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
                          title={`Delete ${resourceReward.resource.name}`}
                        >
                          <DeleteConfirmation
                            itemName={resourceReward.resource.name}
                            itemType="Reward"
                            deleteEndpoint={`/games/${gameId}/admin/actions/${actionId}/remove-reward/${resourceReward.resource.id}`}
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
