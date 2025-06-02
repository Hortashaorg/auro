import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { selectUserResourcesByUserId } from "@queries/selects/resources/selectUserResourcesByUserId.ts";
import type { FC } from "@kalena/framework";

type Props = {
  userId: string;
};

export const ResourcesTable: FC<Props> = async ({ userId, ...props }) => {
  const resources = await selectUserResourcesByUserId(userId);

  return (
    <Table id="player-resources" {...props}>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Resource</TableCell>
          <TableCell isHeader>Name</TableCell>
          <TableCell isHeader>Description</TableCell>
          <TableCell isHeader>Quantity</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow key={resource.resource.id}>
            <TableCell>
              <img
                src={resource.asset.url}
                alt={`${resource.resource.name} icon`}
                className="w-8 h-8 object-cover rounded"
              />
            </TableCell>
            <TableCell>{resource.resource.name}</TableCell>
            <TableCell>{resource.resource.description}</TableCell>
            <TableCell>{resource.user_resource.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
