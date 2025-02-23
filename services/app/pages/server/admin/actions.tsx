import { createRoute } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@comp/layout/Layout.tsx";
import { ModalButton } from "@comp/overlay/modal/ModalButton.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { SelectInput } from "@comp/inputs/form/SelectInput.tsx";

const Actions = () => {
  const context = actionsRoute.context();
  const serverId = context.req.param("serverId");

  return (
    <Layout title="Actions">
      <ModalButton modalRef="createActionModal">
        Create Action
      </ModalButton>
      <Modal modalRef="createActionModal" title="Create Action">
        <Form
          hx-post={`/api/servers/${serverId}/create-action`}
          hx-swap="none"
        >
          <div className="space-y-4">
            <div>
              <Text variant="body" className="mb-2">Action Name</Text>
              <Input
                name="name"
                type="text"
                required
                placeholder="Enter action name"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Description</Text>
              <Textarea
                name="description"
                type="text"
                placeholder="Enter action description"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Action Type</Text>
              <SelectInput
                name="type"
                required
                options={[
                  { value: "command", label: "Command" },
                  { value: "script", label: "Script" },
                  { value: "webhook", label: "Webhook" },
                ]}
                placeholder="Select action type"
              />
            </div>

            <div>
              <Text variant="body" className="mb-2">Command/Script/URL</Text>
              <Textarea
                name="content"
                type="text"
                required
                placeholder="Enter command, script content, or webhook URL"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Create Action
          </Button>
        </Form>
      </Modal>

      {/* We'll create and add the ActionGrid component here later */}
      <div className="mt-4">
        <Text variant="h2">Actions List</Text>
        {/* ActionGrid component will go here */}
      </div>
    </Layout>
  );
};

export const actionsRoute = createRoute({
  path: "/servers/:serverId/actions",
  component: Actions,
  permission: {
    check: isAdminOfServer,
    redirectPath: "/servers",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
