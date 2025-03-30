import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import {
  TabContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@comp/atoms/tabs/index.ts";
import { Modal, ModalButton } from "@comp/molecules/modal/index.ts";
import { AddResourceToActionForm } from "@sections/forms/AddResourceToActionForm.tsx";
import { ModifyResourceOfActionForm } from "@sections/forms/ModifyResourceOfActionForm.tsx";
import { FormButton, FormContext } from "@comp/molecules/form/index.ts";
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
        <Title>
          {actionName}
        </Title>

        <FormContext formId="modify-resource-of-action-form">
          <div className="mb-4">
            <Title>
              Resource Rewards
            </Title>
            <Text>
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
              <Icon icon="plus" variant="inverse" />Add Resource
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
        <Title>
          Usage History for {actionName}
        </Title>
      </TabContent>

      <TabContent tabId="settings">
        <Title>
          {actionName} Settings
        </Title>
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
