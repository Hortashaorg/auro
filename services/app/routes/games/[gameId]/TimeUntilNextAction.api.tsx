import { createRoute } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";
import { throwError } from "@package/common";
import { gameAndUser } from "@queries/user/gameAndUser.ts";

const Handler = async () => {
  const context = timeUntilNextActionRoute.context();
  const gameId = context.req.param("gameId") ??
    throwError("Game ID not found in route params");
  const email = context.var.email ?? throwError("Email not found");

  const { user, game } = await gameAndUser(gameId, email);

  return <TimeUntilNextActionText game={game} user={user} />;
};

export const timeUntilNextActionRoute = createRoute({
  path: "/api/games/:gameId/actions/time-until-next-action",
  component: Handler,
  permission: {
    check: isPlayerOfGame,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
