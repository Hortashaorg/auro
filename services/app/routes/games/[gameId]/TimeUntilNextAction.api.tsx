import { createRoute } from "@kalena/framework";
import { isPlayerOfGame } from "@permissions/index.ts";
import { TimeUntilNextActionText } from "./TimeUntilNextActionText.section.tsx";
import { throwError } from "@package/common";
const Handler = () => {
  const context = timeUntilNextActionRoute.context();
  const gameId = context.req.param("gameId") ??
    throwError("Game ID not found in route params");
  const email = context.var.email ?? throwError("Email not found");

  return <TimeUntilNextActionText gameId={gameId} email={email} />;
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
