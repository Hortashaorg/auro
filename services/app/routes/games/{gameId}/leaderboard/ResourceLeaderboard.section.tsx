import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Section } from "@comp/atoms/layout/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/atoms/table/index.ts";
import { queries } from "@package/database";

type Props = {
  resourceId: string;
};

export const ResourceLeaderboard = async ({ resourceId, ...props }: Props) => {
  const leaderboard = await queries.resources.getUserResourcesByResourceId(
    resourceId,
  );
  const resource = await queries.resources.getResourceById(resourceId);
  const firstEntry = leaderboard[0];

  if (!firstEntry) {
    return (
      <Section id={`resource-leaderboard-${resourceId}`} {...props}>
        <Title level="h2">{resource.resource.name} Leaderboard</Title>
        <Text>No one has collected this resource yet. Be the first!</Text>
      </Section>
    );
  }

  return (
    <Section id={`resource-leaderboard-${resourceId}`} {...props}>
      <div className="flex items-center gap-2 mb-4">
        <img
          src={resource.asset.url}
          alt={resource.resource.name}
          className="w-8 h-8 object-cover rounded"
        />
        <Title level="h2">{resource.resource.name} Leaderboard</Title>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Rank</TableCell>
            <TableCell isHeader>Player</TableCell>
            <TableCell isHeader>Quantity</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <TableRow key={entry.user_resource.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{entry.user.name}</TableCell>
              <TableCell>{entry.user_resource.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};
