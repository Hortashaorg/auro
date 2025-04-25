import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Section } from "@comp/atoms/layout/index.ts";
import { ResourceLeaderboard } from "./ResourceLeaderboard.section.tsx";
import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
import { selectResourcesByGameId } from "@queries/selects/resources/selectResourcesByGameId.ts";

const LeaderboardPage = async () => {
  const context = leaderboardRoute.context();
  const gameId = context.req.param("gameId");
  const resources = await selectResourcesByGameId(gameId);
  const resourcesWithLeaderboard = resources.filter(
    (resource) => resource.resource.leaderboard,
  );

  return (
    <Layout title="Resource Leaderboards">
      {resourcesWithLeaderboard.length === 0
        ? (
          <Section>
            <Title level="h1">Leaderboards</Title>
            <Text>No leaderboards available for this game.</Text>
          </Section>
        )
        : (
          <Section>
            <Title level="h1">Leaderboards</Title>
            <div className="space-y-8">
              {resourcesWithLeaderboard.map((data) => (
                <ResourceLeaderboard
                  key={data.resource.id}
                  resourceId={data.resource.id}
                />
              ))}
            </div>
          </Section>
        )}
    </Layout>
  );
};

const ParamsSchema = v.object({
  gameId: v.pipe(v.string(), v.uuid()),
});

export const leaderboardRoute = createRoute({
  path: "/games/:gameId/leaderboard",
  component: LeaderboardPage,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  paramValidationSchema: ParamsSchema,
});
