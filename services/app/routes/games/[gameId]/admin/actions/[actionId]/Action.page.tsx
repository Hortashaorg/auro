import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfGame } from "@permissions/index.ts";
import { Layout } from "@layout/Layout.tsx";
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
import { AddResourceToActionForm } from "./AddResourceToActionForm.section.tsx";
import { ModifyResourceOfActionForm } from "./ModifyResourceOfActionForm.section.tsx";
import { FormButton, FormContext } from "@comp/molecules/form/index.ts";
import { ButtonGroup } from "@comp/atoms/buttons/index.ts";
import { AddResourceCostToActionForm } from "./AddResourceCostToActionForm.section.tsx";
import { ModifyResourceCostOfActionForm } from "./ModifyResourceCostOfActionForm.section.tsx";

const ActionDetail = async () => {
  const globalContext = getGlobalContext();
  const gameId = globalContext.req.param("gameId");
  const actionId = globalContext.req.param("actionId");

  if (!gameId) throwError("No gameId");
  if (!actionId) throwError("No actionId");

  const action = (await db.select({
    id: schema.action.id,
    name: schema.action.name,
  })
    .from(schema.action)
    .where(
      eq(schema.action.id, actionId),
    ))[0] ?? throwError("Action not found");

  return (
    <Layout title={`Action - ${action.name}`}>
      <TabsSection />
    </Layout>
  );
};

const TabsSection = () => {
  return (
    <Tabs initialTabId="rewards">
      <TabsList>
        <TabsTrigger tabId="rewards">Rewards</TabsTrigger>
        <TabsTrigger tabId="costs">Costs</TabsTrigger>
      </TabsList>

      <TabContent tabId="rewards">
        <FormContext formId="modify-resource-reward-of-action-form">
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
              modalRef="addResourceRewardModal"
              className="flex items-center gap-2"
            >
              <Icon icon="plus" variant="inverse" />Add Reward
            </ModalButton>
            <FormButton
              formId="modify-resource-reward-of-action-form"
              variant="primary"
              disableWhenClean
              disableDuringSubmit
            >
              Save Rewards
            </FormButton>
          </ButtonGroup>

          <Modal modalRef="addResourceRewardModal" title="Add Resource Reward">
            <AddResourceToActionForm />
          </Modal>
        </FormContext>
      </TabContent>

      <TabContent tabId="costs">
        <FormContext formId="modify-resource-cost-of-action-form">
          <div className="mb-4">
            <Title>
              Resource Costs
            </Title>
            <Text>
              Resources consumed when performing this action
            </Text>
          </div>

          <ModifyResourceCostOfActionForm />

          <ButtonGroup className="mt-4">
            <ModalButton
              variant="inverse"
              modalRef="addResourceCostModal"
              className="flex items-center gap-2"
            >
              <Icon icon="plus" variant="inverse" />Add Cost
            </ModalButton>
            <FormButton
              formId="modify-resource-cost-of-action-form"
              variant="primary"
              disableWhenClean
              disableDuringSubmit
            >
              Save Costs
            </FormButton>
          </ButtonGroup>

          <Modal modalRef="addResourceCostModal" title="Add Resource Cost">
            <AddResourceCostToActionForm />
          </Modal>
        </FormContext>
      </TabContent>
    </Tabs>
  );
};

export const actionRoute = createRoute({
  path: "/games/:gameId/admin/actions/:actionId",
  component: ActionDetail,
  permission: {
    check: isAdminOfGame,
    redirectPath: "/games",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
