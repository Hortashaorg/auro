import { HtmxWrapper } from "@comp/atoms/layout/index.ts";
import { Section } from "@comp/atoms/layout/index.ts";
import { Grid } from "@comp/atoms/layout/index.ts";
import { Card, CardBody } from "@comp/atoms/card/index.ts";
import { Badge, Title } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { getGlobalContext, type JSX } from "@kalena/framework";
import { throwError } from "@package/common";
import { CardActions } from "@comp/atoms/card/CardActions.tsx";
import { queries } from "@package/database";

type Props = JSX.IntrinsicElements["div"];

export const GameGrid = async ({ ...props }: Props) => {
  const globalContext = getGlobalContext();

  const email = globalContext.var.email ?? throwError("No email");

  const adminGames = (await queries.games.getGamesByEmail(email)).filter((
    game,
  ) => game.user.type === "admin");

  const games = (await queries.games.getGames()).filter((game) => game.online);

  return (
    <HtmxWrapper {...props} id="game-section">
      {adminGames.length > 0 && (
        <Section>
          <Title level="h2">My Games</Title>
          <Grid gap="md" content="small">
            {adminGames.map((data) => (
              <GameAdminCard key={data.game.id} game={data.game} />
            ))}
          </Grid>
        </Section>
      )}

      <Section>
        <Title level="h2">Available Games</Title>
        <Grid gap="md" content="small">
          {games.map((game) => <GameCard key={game.id} game={game} />)}
        </Grid>
      </Section>
    </HtmxWrapper>
  );
};

const GameCard = ({ game }: {
  game: {
    id: string;
    name: string;
    online: boolean;
  };
}) => {
  return (
    <Card>
      <CardBody>
        <Title>{game.name}</Title>
        <Badge
          variant={game.online ? "success" : "danger"}
          size="sm"
        >
          {game.online ? "Online" : "Offline"}
        </Badge>
      </CardBody>
      <CardActions>
        <ButtonLink
          href={`/games/${game.id}`}
        >
          Enter
        </ButtonLink>
      </CardActions>
    </Card>
  );
};

const GameAdminCard = ({ game }: {
  game: {
    id: string;
    name: string;
    online: boolean;
  };
}) => {
  return (
    <Card>
      <CardBody>
        <Title>{game.name}</Title>
        <Badge
          variant={game.online ? "success" : "danger"}
          size="sm"
        >
          {game.online ? "Online" : "Offline"}
        </Badge>
      </CardBody>
      <CardActions>
        <ButtonLink
          href={`/games/${game.id}/admin`}
        >
          Enter
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
