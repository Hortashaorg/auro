import type { JSX } from "@kalena/framework";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { FormButton } from "@comp/inputs/form/FormButton.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Card } from "@comp/display/card/Card.tsx";

type Props = JSX.IntrinsicElements["div"] & {
  serverData: {
    server: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string | null;
    };
  };
  defaultNickname: string;
};

export const ServerName = ({
  serverData,
  defaultNickname,
  ...props
}: Props) => {
  const { server, user } = serverData;
  const formId = `server-name-form-${server.id}`;
  const displayName = user.name || defaultNickname;

  return (
    <div
      {...props}
      className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
      x-data="{ showEditModal: false }"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Text variant="h3" className="text-base font-medium">
            {server.name}
          </Text>
          <Text
            variant="body"
            className="text-gray-500 dark:text-gray-400 text-sm"
          >
            {displayName}
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
            x-on:click="showEditModal = true"
          >
            <span className="icon" data-lucide="edit-2"></span>
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="flex items-center gap-1"
            hx-post={`/api/server/${server.id}/leave`}
            hx-confirm="Are you sure you want to leave this server? This action cannot be undone."
            hx-swap="outerHTML"
            hx-target="closest div"
          >
            <span className="icon" data-lucide="trash-2"></span>
            Remove
          </Button>
        </div>
      </div>

      <div
        x-show="showEditModal"
        x-cloak
        className="mt-4"
      >
        <Card
          padding="md"
          shadow="sm"
          border="subtle"
          className="bg-gray-50 dark:bg-gray-800"
        >
          <Form
            id={formId}
            className="space-y-3"
            hx-post="/api/server/update-username"
            hx-swap="none"
            x-data="{ errors: {} }"
          >
            <input type="hidden" name="serverId" value={server.id} />

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`name-${server.id}`}
                className="text-sm font-medium"
              >
                Display Name
              </label>
              <div className="flex gap-2">
                <Input
                  id={`name-${server.id}`}
                  name="name"
                  placeholder={defaultNickname || "Your name"}
                  value={user.name || ""}
                  required
                  minLength={3}
                  maxLength={50}
                  className="flex-1"
                />
                <FormButton
                  type="submit"
                  formId={formId}
                  variant="primary"
                  size="default"
                >
                  Save
                </FormButton>
                <Button
                  variant="secondary"
                  size="default"
                  x-on:click="showEditModal = false"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};
