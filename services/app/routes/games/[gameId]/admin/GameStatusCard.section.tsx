import { Badge, Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import { Switch } from "@comp/atoms/form/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import type { InferSelectModel, schema } from "@package/database";
import { Flex } from "@comp/atoms/layout/index.ts";

export const GameStatusCard = (
  { game }: { game: InferSelectModel<typeof schema.game> },
) => {
  return (
    <Card width="fit" id="game-status">
      <CardBody>
        <Title>Game Status</Title>
        <Flex>
          <Badge
            variant={game.online ? "success" : "danger"}
            className="flex items-center gap-1"
          >
            {game.online
              ? (
                <>
                  <Icon icon="server" variant="none" />
                  Online
                </>
              )
              : (
                <>
                  <Icon icon="server-off" variant="none" />
                  Offline
                </>
              )}
          </Badge>
          <Text
            variant="body"
            size="sm"
            as="span"
          >
            {game.online
              ? "Game is currently running and accessible to players"
              : "Game is currently offline and inaccessible to players"}
          </Text>
        </Flex>
        <Switch
          name="online"
          initialState={game.online}
          hx-post={`/api/games/${game.id}/admin/toggle-game-status`}
          hx-target="#game-status"
          hx-swap="outerHTML"
          variant={game.online ? "success" : "danger"}
          label={game.online ? "Enabled" : "Disabled"}
        />
        <Text
          variant="body"
          size="sm"
        >
          Toggle the switch to {game.online ? "disable" : "enable"} the game
        </Text>
      </CardBody>
    </Card>
  );
};
