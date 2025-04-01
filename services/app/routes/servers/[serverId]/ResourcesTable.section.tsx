import { Title } from "@comp/atoms/typography/index.ts";
import { Section } from "@comp/atoms/layout/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { getUserResources } from "@queries/resource/userResources.ts";

type Props = {
  serverId: string;
};

export const ResourcesTable = async ({ serverId, ...props }: Props) => {
  const resources = await getUserResources(serverId);

  return (
    <Section id="player-resources" {...props}>
      <Title level="h2">Resources</Title>
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
