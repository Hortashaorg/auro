import { Text } from "@comp/typography/index.ts";
import { Section } from "@comp/wrappers/index.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@comp/table/index.ts";
import { getResourceLeaderboard } from "@queries/resourceLeaderboard.ts";
import { getResource } from "@queries/getResource.ts";

type Props = {
  resourceId: string;
};

export const ResourceLeaderboard = async ({ resourceId, ...props }: Props) => {
  const leaderboard = await getResourceLeaderboard(resourceId);
  const resource = await getResource(resourceId);
  const firstEntry = leaderboard[0];

  // If we have no entries, we can't show the leaderboard yet
  if (!firstEntry) {
    return (
      <Section id={`resource-leaderboard-${resourceId}`} {...props}>
        <Text variant="h2">{resource.name} Leaderboard</Text>
        <Text>No one has collected this resource yet. Be the first!</Text>
      </Section>
    );
  }

  return (
    <Section id={`resource-leaderboard-${resourceId}`} {...props}>
      <div className="flex items-center gap-2 mb-4">
        <img
          src={firstEntry.asset.url}
          alt={firstEntry.resource.name}
          className="w-8 h-8 object-cover rounded"
        />
        <Text variant="h2">{resource.name} Leaderboard</Text>
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
            <TableRow key={entry.user.id}>
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
