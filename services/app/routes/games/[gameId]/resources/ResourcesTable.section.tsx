import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { getUserResources } from "@queries/resource/userResources.ts";

type Props = {
  gameId: string;
};

export const ResourcesTable = async ({ gameId, ...props }: Props) => {
  const resources = await getUserResources(gameId);

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
