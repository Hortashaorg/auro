import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { Tab } from "@comp/display/tabs/Tab.tsx";
import { Tabs } from "@comp/display/tabs/Tabs.tsx";
import { TabsList } from "@comp/display/tabs/TabsList.tsx";
import { TabsTrigger } from "@comp/display/tabs/TabsTrigger.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Modal } from "@comp/display/modal/Modal.tsx";
import { ModalButton } from "@comp/display/modal/ModalButton.tsx";
import { AddResourceToActionForm } from "@sections/forms/AddResourceToActionForm.tsx";
import { ModifyResourceOfActionForm } from "@sections/forms/ModifyResourceOfActionForm.tsx";
import { Flex } from "@comp/layout/Flex.tsx";

const ActionDetail = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  if (!serverId) throwError("No serverId");
  if (!actionId) throwError("No actionId");

  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
  }).from(schema.action)
    .where(
      eq(schema.action.id, actionId),
    );

  const action = actions[0] ?? throwError("Action not found");

  return (
    <Layout title={`Action - ${action.name}`}>
      <TabsSection
        actionName={action.name}
        serverId={serverId}
        actionId={actionId}
      />
    </Layout>
  );
};

type TabsSectionProps = {
  actionName: string;
  serverId: string;
  actionId: string;
};

const TabsSection = (
  { actionName }: TabsSectionProps,
) => {
  return (
    <Tabs initialTabId="rewards">
      <TabsList>
        <TabsTrigger tabId="rewards">Rewards</TabsTrigger>
        <TabsTrigger tabId="history">History</TabsTrigger>
        <TabsTrigger tabId="settings">Settings</TabsTrigger>
      </TabsList>

      <Tab tabId="rewards">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName}
        </Text>

        <div x-data="{ formIsDirty: false }">
          <div className="mb-4">
            <Text variant="h3">
              Resource Rewards
            </Text>
            <Text variant="body">
              Resources that players can gather from this action
            </Text>
          </div>

          <ModifyResourceOfActionForm />

          <Flex gap="md">
            <ModalButton modalRef="addResourceModal">Add Resource</ModalButton>
            <Button
              id="modify-resource-of-action-button"
              variant="primary"
              type="submit"
              x-bind:disabled="!formIsDirty"
              form="modify-resource-of-action-form"
            >
              Save Resources
            </Button>
          </Flex>

          <Modal modalRef="addResourceModal" title="Add Resource">
            <AddResourceToActionForm />
          </Modal>
        </div>
      </Tab>

      <Tab tabId="history">
        <Text variant="h3">
          Usage History for {actionName}
        </Text>
      </Tab>

      <Tab tabId="settings">
        <Text variant="h3">
          {actionName} Settings
        </Text>
      </Tab>
    </Tabs>
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
