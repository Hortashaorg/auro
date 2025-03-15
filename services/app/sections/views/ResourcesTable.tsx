import { Text } from "@comp/content/Text.tsx";
import { Section } from "@comp/layout/Section.tsx";
import { Table } from "@comp/display/table/Table.tsx";
import { TableBody } from "@comp/display/table/TableBody.tsx";
import { TableCell } from "@comp/display/table/TableCell.tsx";
import { TableHeader } from "@comp/display/table/TableHeader.tsx";
import { TableRow } from "@comp/display/table/TableRow.tsx";
import { getUserResources } from "@queries/userResources.ts";

type Props = {
  serverId: string;
};

export const ResourcesTable = async ({ serverId }: Props) => {
  const resources = await getUserResources(serverId);

  return (
    <Section id="player-resources">
      <Text variant="h2">Resources</Text>
      <Table>
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
                  alt={resource.resource.name}
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
    </Section>
  );
};
