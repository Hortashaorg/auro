import { createRoute, v } from "@kalena/framework";
import { isPlayerOfServer } from "@permissions/index.ts";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { getUserByEmail } from "@queries/user/getUserByEmail.ts";
import { createEvents } from "@comp/utils/events.ts";
import { ActionsSection } from "./ActionsSection.section.tsx";

type ResourceEntry = {
  type: "reward" | "cost";
  resourceId: string;
  amount: number;
};

type UserResource = {
  id: string;
  userId: string;
  resourceId: string;
  quantity: number;
};

const ExecuteAction = async () => {
  const context = executeActionRoute.context();
  const params = context.req.valid("param");
  const { actionId, serverId } = params.success
    ? params.output
    : throwError("Invalid params");

  const userEmail = context.var.email ?? throwError("Missing user email");

  const user = await getUserByEmail(userEmail, serverId);

  if (user.availableActions <= 0) {
    context.header(
      "HX-Trigger",
      createEvents([
        {
          name: "toast-show",
          values: {
            message: "You have no actions left",
            title: "No Actions Left",
            variant: "danger",
          },
        },
      ]),
    );
    return <ActionsSection hx-swap-oob="true" />;
  }

  const costs = await db.select({
    resourceId: schema.actionResourceCost.resourceId,
    quantity: schema.actionResourceCost.quantity,
    resourceName: schema.resource.name,
  })
    .from(schema.actionResourceCost)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceCost.resourceId, schema.resource.id),
    )
    .where(
      eq(schema.actionResourceCost.actionId, actionId),
    );

  const userResources = await db.select({
    resourceId: schema.userResource.resourceId,
    quantity: schema.userResource.quantity,
  })
    .from(schema.userResource)
    .where(
      eq(schema.userResource.userId, user.id),
    );

  for (const cost of costs) {
    const userResource = userResources.find(
      (resource) => resource.resourceId === cost.resourceId,
    );

    if (!userResource || userResource.quantity < cost.quantity) {
      context.header(
        "HX-Trigger",
        createEvents([
          {
            name: "toast-show",
            values: {
              message: `You don't have enough ${cost.resourceName}`,
              title: "Insufficient Resources",
              variant: "danger",
            },
          },
        ]),
      );
      return <ActionsSection hx-swap-oob="true" />;
    }
  }

  const possibleRewards = await db.select()
    .from(schema.actionResourceReward)
    .innerJoin(
      schema.resource,
      eq(schema.actionResourceReward.resourceId, schema.resource.id),
    )
    .where(eq(schema.actionResourceReward.actionId, actionId));

  const earnedRewards = possibleRewards.filter((reward) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    return roll <= reward.action_resource_reward.chance;
  });

  const rewardUpdates = earnedRewards.map(
    (reward) => {
      if (
        reward.action_resource_reward.quantityMin >
          reward.action_resource_reward.quantityMax
      ) throwError("Invalid quantity range");

      const quantity = Math.floor(
        Math.random() *
          (reward.action_resource_reward.quantityMax -
            reward.action_resource_reward.quantityMin + 1),
      ) + reward.action_resource_reward.quantityMin;

      return {
        resourceId: reward.resource.id,
        quantity,
      };
    },
  );

  const userResourcesWithIds = await db.select({
    id: schema.userResource.id,
    userId: schema.userResource.userId,
    resourceId: schema.userResource.resourceId,
    quantity: schema.userResource.quantity,
  })
    .from(schema.userResource)
    .where(eq(schema.userResource.userId, user.id));

  await db.transaction(async (tx) => {
    const updatedResources: UserResource[] = [...userResourcesWithIds];

    for (const cost of costs) {
      const resourceIndex = updatedResources.findIndex(
        (resource) => resource.resourceId === cost.resourceId,
      );

      const currentResource = updatedResources[resourceIndex];

      if (!currentResource) continue;

      await tx.update(schema.userResource)
        .set({
          quantity: currentResource.quantity - cost.quantity,
        })
        .where(eq(schema.userResource.id, currentResource.id));

      updatedResources[resourceIndex] = {
        ...currentResource,
        quantity: currentResource.quantity - cost.quantity,
      };
    }

    for (const reward of rewardUpdates) {
      const resourceIndex = updatedResources.findIndex(
        (resource) => resource.resourceId === reward.resourceId,
      );

      if (resourceIndex !== -1) {
        const currentResource = updatedResources[resourceIndex];

        if (!currentResource) continue;

        await tx.update(schema.userResource)
          .set({
            quantity: currentResource.quantity + reward.quantity,
          })
          .where(eq(schema.userResource.id, currentResource.id));
      } else {
        await tx.insert(schema.userResource).values({
          userId: user.id,
          resourceId: reward.resourceId,
          quantity: reward.quantity,
        });
      }
    }

    await tx.update(schema.user)
      .set({
        availableActions: user.availableActions - 1,
      })
      .where(eq(schema.user.id, user.id));

    const resourceEntries: ResourceEntry[] = [
      ...costs.map((cost): ResourceEntry => ({
        type: "cost",
        resourceId: cost.resourceId,
        amount: cost.quantity,
      })),
      ...rewardUpdates.map((reward): ResourceEntry => ({
        type: "reward",
        resourceId: reward.resourceId,
        amount: reward.quantity,
      })),
    ];

    await tx.insert(schema.actionLog).values({
      serverId,
      actionId,
      userId: user.id,
      version: 1,
      data: { resource: resourceEntries },
    });
  });

  context.header(
    "HX-Trigger",
    createEvents([
      {
        name: "toast-show",
        values: {
          message: "You have successfully executed the action",
          title: "Success",
          variant: "success",
        },
      },
    ]),
  );
  return <ActionsSection hx-swap-oob="true" />;
};

export const executeActionRoute = createRoute({
  path: "/api/servers/:serverId/actions/:actionId/execute",
  component: ExecuteAction,
  permission: {
    check: isPlayerOfServer,
    redirectPath: "/servers",
  },
  paramValidationSchema: v.object({
    serverId: v.pipe(v.string(), v.uuid()),
    actionId: v.pipe(v.string(), v.uuid()),
  }),
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
