import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { Tab } from "@comp/layout/tabs/Tab.tsx";
import { Tabs } from "@comp/layout/tabs/Tabs.tsx";
import { TabsList } from "@comp/layout/tabs/TabsList.tsx";
import { TabsTrigger } from "@comp/layout/tabs/TabsTrigger.tsx";
import { Table } from "@comp/data/Table.tsx";
import { TableHeader } from "@comp/data/TableHeader.tsx";
import { TableBody } from "@comp/data/TableBody.tsx";
import { TableRow } from "@comp/data/TableRow.tsx";
import { TableCell } from "@comp/data/TableCell.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Modal } from "@comp/overlay/modal/Modal.tsx";
import { ModalIcon } from "@comp/overlay/modal/ModalIcon.tsx";
import { AddResourceToActionForm } from "@sections/forms/AddResourceToActionForm.tsx";
import { ModifyResourceOfActionForm } from "@sections/forms/ModifyResourceOfActionForm.tsx";

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
      <TabsList className="mb-6">
        <TabsTrigger tabId="rewards">Rewards</TabsTrigger>
        <TabsTrigger tabId="history">History</TabsTrigger>
        <TabsTrigger tabId="settings">Settings</TabsTrigger>
      </TabsList>

      <Tab tabId="rewards">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName}
        </Text>

        <div>
          <div className="mb-4">
            <Text variant="h3" className="text-lg font-semibold">
              Resource Rewards
            </Text>
            <Text variant="body" className="text-text-500 dark:text-text-400">
              Resources that players can gather from this action
            </Text>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Resource</TableCell>
                <TableCell isHeader>Drop Rate (%)</TableCell>
                <TableCell isHeader>Min Quantity</TableCell>
                <TableCell isHeader>Max Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ModifyResourceOfActionForm />
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <ModalIcon
                    modalRef="addResourceModal"
                    icon="plus"
                    label="Add resource"
                    className="mx-auto"
                  />
                  <Modal modalRef="addResourceModal" title="Add Resource">
                    <AddResourceToActionForm />
                  </Modal>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button
            variant="primary"
            size="small"
            type="submit"
            form="modify-resource-of-action-form"
          >
            Save Resources
          </Button>
        </div>
      </Tab>

      <Tab tabId="history">
        <Text variant="h3" className="text-xl font-bold mb-6">
          Usage History for {actionName}
        </Text>
        {/* History tab content */}
      </Tab>

      <Tab tabId="settings">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName} Settings
        </Text>
        {/* Settings tab content */}
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
