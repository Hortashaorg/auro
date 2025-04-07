import { Button, ButtonGroup } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";

type Props = {
  itemName: string;
  itemType: string;
  deleteEndpoint: string;
};

export const DeleteConfirmation = (
  { itemName, itemType, deleteEndpoint }: Props,
) => {
  return (
    <Flex direction="col" gap="md">
      <div className="mb-2">
        Are you sure you want to remove <strong>{itemName}</strong>{" "}
        {itemType.toLowerCase()} from this action?
      </div>
      <ButtonGroup justify="end">
        <Button
          type="button"
          variant="danger"
          hx-post={deleteEndpoint}
          hx-swap="none"
          data-dismiss="modal"
        >
          Delete
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
