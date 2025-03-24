import { Text } from "@comp/content/Text.tsx";
import { Section } from "@comp/layout/Section.tsx";
import { Table } from "@comp/display/table/Table.tsx";
import { TableBody } from "@comp/display/table/TableBody.tsx";
import { TableCell } from "@comp/display/table/TableCell.tsx";
import { TableHeader } from "@comp/display/table/TableHeader.tsx";
import { TableRow } from "@comp/display/table/TableRow.tsx";
import { getResourceLeaderboard } from "@queries/resourceLeaderboard.ts";

type Props = {
  resourceId: string;
};

export const ResourceLeaderboard = async ({ resourceId, ...props }: Props) => {
  const leaderboard = await getResourceLeaderboard(resourceId);

  return (
    <Section id="resource-leaderboard" {...props}>
      <Text variant="h2">Leaderboard</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Rank</TableCell>
            <TableCell isHeader>Resource</TableCell>
            <TableCell isHeader>Player</TableCell>
            <TableCell isHeader>Quantity</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <TableRow key={entry.user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={entry.asset.url}
                    alt={entry.resource.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span>{entry.resource.name}</span>
                </div>
              </TableCell>
              <TableCell>{entry.user.name}</TableCell>
              <TableCell>{entry.user_resource.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};
