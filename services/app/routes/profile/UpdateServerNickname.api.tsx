import { createRoute, type FC, v } from "@kalena/framework";
import { isLoggedIn } from "@permissions/index.ts";
import { and, db, eq, PostgresError, schema } from "@package/database";
import { throwError } from "@package/common";
import { createEvents } from "@comp/utils/events.ts";
import { TableCell, TableRow } from "@comp/atoms/table/index.ts";
import { Text } from "@comp/atoms/typography/index.ts";
import { ModalButton } from "@comp/molecules/modal/index.ts";

const formSchema = v.object({
  serverId: v.string(),
  nickname: v.string(),
});

type UserSchemaType = typeof schema.user.$inferSelect;
type ServerSchemaType = typeof schema.server.$inferSelect;

type RenderTableRowProps = {
  user: UserSchemaType;
  server: Pick<ServerSchemaType, "id" | "name">;
};

const RenderTableRow: FC<RenderTableRowProps> = ({ user, server }) => {
  const currentNickname = user.name ?? "";
  const modalRef = `editServerNicknameModal-${server.id}`;

  return (
    <TableRow key={server.id} id={`nickname-row-${server.id}`}>
      <TableCell>{server.name ?? "Unnamed Server"}</TableCell>
      <TableCell>
        <Text>{currentNickname || "No Nickname Set"}</Text>
      </TableCell>
      <TableCell>
        <ModalButton modalRef={modalRef} variant="outline" size="xs">
          Edit
        </ModalButton>
      </TableCell>
    </TableRow>
  );
};

const UpdateHandler = async () => {
  const context = updateServerNicknameRoute.context();
  const email = context.var.email ?? throwError("Email not found");

  const result = context.req.valid("form");
  if (!result.success) {
    const errorEvents: Record<string, string> = {};
    for (const issue of result.issues) {
      errorEvents[issue.path?.[0]?.key as string ?? "form"] = issue.message;
    }
    context.header(
      "HX-Trigger",
      createEvents([{ name: "form-error", values: errorEvents }]),
    );
    context.status(400);
    return <p>Validation Error</p>;
  }

  const { serverId, nickname } = result.output;

  const account = await db.query.account.findFirst({
    columns: { id: true },
    where: (acc, { eq }) => eq(acc.email, email),
  }) ?? throwError("Account not found");
  const accountId = account.id;

  try {
    await db.update(schema.user)
      .set({ name: nickname })
      .where(and(
        eq(schema.user.serverId, serverId as string),
        eq(schema.user.accountId, accountId),
      ));

    const updatedUser = await db.query.user.findFirst({
      where: and(
        eq(schema.user.serverId, serverId),
        eq(schema.user.accountId, accountId),
      ),
    }) ?? throwError("Failed to fetch updated user data");
    const serverData = await db.query.server.findFirst({
      columns: { id: true, name: true },
      where: eq(schema.server.id, serverId),
    }) ?? throwError("Failed to fetch server data");

    context.header(
      "HX-Trigger",
      createEvents([
        { name: "dialog-close", values: { value: true } },
        {
          name: "toast-show",
          values: {
            message: "Nickname updated!",
            variant: "success",
            title: "Success",
          },
        },
      ]),
    );

    return (
      <RenderTableRow
        user={updatedUser}
        server={serverData}
        hx-swap-oob="#nickname-row-${serverId}"
      />
    );
  } catch (error) {
    if (error instanceof PostgresError) {
      context.header(
        "HX-Trigger",
        createEvents([{
          name: "form-error",
          values: { form: "Database error occurred." },
        }]),
      );
      context.status(500);
      return <p>Database Error</p>;
    }
    throw error;
  }
};

export const updateServerNicknameRoute = createRoute({
  path: "/api/profile/update-server-nickname",
  component: UpdateHandler,
  formValidationSchema: formSchema,
  permission: { check: isLoggedIn, redirectPath: "/" },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
