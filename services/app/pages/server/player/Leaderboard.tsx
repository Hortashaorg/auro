import { Text, Title } from "@comp/atoms/typography/index.ts";
import { Section } from "@comp/atoms/layout/index.ts";
import { getLeaderboardResources } from "@queries/resourceLeaderboard.ts";
import { ResourceLeaderboard } from "@sections/views/ResourceLeaderboard.tsx";
import { createRoute, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";

const LeaderboardPage = async () => {
  const context = leaderboardRoute.context();
  const serverId = context.req.param("serverId");
  const resources = await getLeaderboardResources(serverId);

  return (
    <Layout title="Resource Leaderboards">
      {resources.length === 0
        ? (
          <Section>
            <Title level="h1">Leaderboards</Title>
            <Text>No leaderboards available for this server.</Text>
          </Section>
        )
        : (
          <Section>
            <Title level="h1">Leaderboards</Title>
            <div className="space-y-8">
              {resources.map((resource) => (
                <ResourceLeaderboard
                  key={resource.id}
                  resourceId={resource.id}
                />
              ))}
            </div>
          </Section>
        )}
    </Layout>
  );
};

const ParamsSchema = v.object({
  serverId: v.pipe(v.string(), v.uuid()),
});

export const leaderboardRoute = createRoute({
  path: "/servers/:serverId/leaderboard",
  component: LeaderboardPage,
  permission: {
    check: isLoggedIn,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  paramValidationSchema: ParamsSchema,
});
