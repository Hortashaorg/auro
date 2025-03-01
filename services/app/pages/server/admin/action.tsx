import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { Badge } from "@comp/content/Badge.tsx";
import { Img } from "@comp/content/Img.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";

type ActionDetails = {
  id: string;
  name: string;
  description: string | null;
  cooldownMinutes: number;
  repeatable: boolean;
  assetUrl: string;
  locationName: string | null;
};

const ActionDetail = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  if (!serverId) throwError("No serverId");
  if (!actionId) throwError("No actionId");

  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
    description: schema.action.description,
    cooldownMinutes: schema.action.cooldownMinutes,
    repeatable: schema.action.repeatable,
    assetUrl: schema.asset.url,
    locationName: schema.location.name,
  }).from(schema.action)
    .innerJoin(schema.asset, eq(schema.action.assetId, schema.asset.id))
    .leftJoin(schema.location, eq(schema.action.locationId, schema.location.id))
    .where(
      eq(schema.action.id, actionId),
    );

  if (!actions.length) throwError("Action not found");

  const action = actions[0] as ActionDetails;

  return (
    <Layout title={`Action - ${action.name}`}>
      <ButtonLink href={`/servers/${serverId}/actions`} variant="outline">
        Back to Actions
      </ButtonLink>

      <Card className="p-6 space-y-6">
        <Flex gap="lg">
          <div className="w-48 h-48 overflow-hidden rounded-md">
            <Img
              src={action.assetUrl}
              alt={action.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <Text variant="h2" className="mb-2">Details</Text>
              {action.description && (
                <Text
                  variant="body"
                  className="text-text-500 dark:text-text-400"
                >
                  {action.description}
                </Text>
              )}
            </div>

            <div className="space-y-2">
              <Text variant="h3">Properties</Text>
              <div className="flex flex-wrap gap-2">
                <Badge variant="warning" className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {action.cooldownMinutes}m cooldown
                </Badge>
                <Badge
                  variant={action.repeatable ? "success" : "danger"}
                  className="flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {action.repeatable
                      ? (
                        <path d="M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" />
                      )
                      : <path d="M18 6L6 18M6 6l12 12" />}
                  </svg>
                  {action.repeatable ? "Repeatable" : "One-time"}
                </Badge>
                {action.locationName && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {action.locationName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Flex>
      </Card>
    </Layout>
  );
};

export const actionDetailRoute = createRoute({
  path: "/servers/:serverId/actions/:actionId",
  component: ActionDetail,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
