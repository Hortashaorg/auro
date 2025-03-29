import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/typography/index.ts";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import {
  TabContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../components/atoms/tabs/index.ts";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { AddResourceToActionForm } from "@sections/forms/AddResourceToActionForm.tsx";
import { ModifyResourceOfActionForm } from "@sections/forms/ModifyResourceOfActionForm.tsx";
import { FormButton, FormContext } from "@comp/form/index.ts";
import { ButtonGroup } from "@comp/atoms/buttons/index.ts";

const ActionDetail = async () => {
  const globalContext = getGlobalContext();
  const serverId = globalContext.req.param("serverId");
  const actionId = globalContext.req.param("actionId");

  if (!serverId) throwError("No serverId");
  if (!actionId) throwError("No actionId");

  const actions = await db.select({
    id: schema.action.id,
    name: schema.action.name,
  })
    .from(schema.action)
    .where(
      eq(schema.action.id, actionId),
    );

  const action = actions[0] ?? throwError("Action not found");

  return (
    <Layout title={`Action - ${action.name}`}>
      <TabsSection
        actionName={action.name}
      />
    </Layout>
  );
};

type TabsSectionProps = {
  actionName: string;
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

      <TabContent tabId="rewards">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName}
        </Text>

        <FormContext formId="modify-resource-of-action-form">
          <div className="mb-4">
            <Text variant="h3">
              Resource Rewards
            </Text>
            <Text variant="body">
              Resources that players can gather from this action
            </Text>
          </div>

          <ModifyResourceOfActionForm />

          <ButtonGroup className="mt-4">
            <ModalButton
              variant="inverse"
              modalRef="addResourceModal"
              className="flex items-center gap-2"
            >
              <i data-lucide="plus" width={16} height={16} />Add Resource
            </ModalButton>
            <FormButton
              formId="modify-resource-of-action-form"
              variant="primary"
              disableWhenClean
              disableDuringSubmit
            >
              Save Resources
            </FormButton>
          </ButtonGroup>

          <Modal modalRef="addResourceModal" title="Add Resource">
            <AddResourceToActionForm />
          </Modal>
        </FormContext>
      </TabContent>

      <TabContent tabId="history">
        <Text variant="h3">
          Usage History for {actionName}
        </Text>
      </TabContent>

      <TabContent tabId="settings">
        <Text variant="h3">
          {actionName} Settings
        </Text>
      </TabContent>
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
