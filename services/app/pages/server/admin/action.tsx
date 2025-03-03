import { createRoute, getGlobalContext } from "@kalena/framework";
import { isAdminOfServer } from "@permissions/index.ts";
import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { db, eq, schema } from "@package/database";
import { throwError } from "@package/common";
import { Badge } from "@comp/content/Badge.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { Tab } from "@comp/layout/tabs/Tab.tsx";
import { Tabs } from "@comp/layout/tabs/Tabs.tsx";
import { TabsList } from "@comp/layout/tabs/TabsList.tsx";
import { TabsTrigger } from "@comp/layout/tabs/TabsTrigger.tsx";
import { Switch } from "@comp/inputs/Switch.tsx";
import { Table } from "@comp/data/Table.tsx";
import { TableHeader } from "@comp/data/TableHeader.tsx";
import { TableBody } from "@comp/data/TableBody.tsx";
import { TableRow } from "@comp/data/TableRow.tsx";
import { TableCell } from "@comp/data/TableCell.tsx";
import { Range } from "@comp/inputs/form/Range.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { FormControl } from "@comp/inputs/form/FormControl.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";

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

  const action = actions[0] ?? throwError("Action not found");

  return (
    <Layout title={`Action - ${action.name}`}>
      <ButtonLink href={`/servers/${serverId}/actions`} variant="outline">
        Back to Actions
      </ButtonLink>

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

const TabsSection = ({ actionName, serverId, actionId }: TabsSectionProps) => {
  return (
    <Tabs initialTabId="rewards">
      <TabsList className="mb-6">
        <TabsTrigger tabId="rewards">Rewards</TabsTrigger>
        <TabsTrigger tabId="history">History</TabsTrigger>
        <TabsTrigger tabId="settings">Settings</TabsTrigger>
      </TabsList>

      {/* Rewards Tab */}
      <Tab tabId="rewards">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName} Rewards
        </Text>

        {/* Item Rewards Section */}
        <div className="mb-8">
          <div className="mb-4">
            <Text variant="h3" className="text-lg font-semibold">
              Item Rewards
            </Text>
            <Text variant="body" className="text-text-500 dark:text-text-400">
              Items that players can obtain from this action
            </Text>
          </div>

          <Form
            hx-post={`/api/servers/${serverId}/actions/${actionId}/rewards`}
            hx-swap="none"
          >
            <Table>
              <TableHeader>
                <TableRow isHeader>
                  <TableCell isHeader>Item</TableCell>
                  <TableCell isHeader>Drop Rate (%)</TableCell>
                  <TableCell isHeader align="right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody colSpan={3}>
                <TableRow hoverable zebra index={0}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="Sword">⚔️</span>
                      <span>Wooden Sword</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormControl inputName="woodenSwordDropRate">
                      <Range
                        name="woodenSwordDropRate"
                        min={0}
                        max={100}
                        defaultValue={25}
                        unitSuffix="%"
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      type="button"
                      className="text-danger-500 hover:text-danger-700"
                    >
                      <span aria-hidden="true">🗑️</span>
                      <span className="sr-only">Delete</span>
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow hoverable zebra index={1}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="Coin">🪙</span>
                      <span>Gold Coin</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormControl inputName="goldCoinDropRate">
                      <Range
                        name="goldCoinDropRate"
                        min={0}
                        max={100}
                        defaultValue={100}
                        unitSuffix="%"
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      type="button"
                      className="text-danger-500 hover:text-danger-700"
                    >
                      <span aria-hidden="true">🗑️</span>
                      <span className="sr-only">Delete</span>
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>

          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400"
            >
              <span>+</span> Add Item Reward
            </button>
          </div>
        </div>

        {/* Resource Rewards Section */}
        <div>
          <div className="mb-4">
            <Text variant="h3" className="text-lg font-semibold">
              Resource Rewards
            </Text>
            <Text variant="body" className="text-text-500 dark:text-text-400">
              Resources that players can gather from this action
            </Text>
          </div>

          <Form
            hx-post={`/api/servers/${serverId}/actions/${actionId}/resources`}
            hx-swap="none"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Resource</TableCell>
                  <TableCell isHeader>Drop Rate (%)</TableCell>
                  <TableCell isHeader>Min Quantity</TableCell>
                  <TableCell isHeader>Max Quantity</TableCell>
                  <TableCell isHeader align="right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody colSpan={5}>
                <TableRow hoverable>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="Wood">🪵</span>
                      <span>Wood</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormControl inputName="woodDropRate">
                      <Range
                        name="woodDropRate"
                        min={0}
                        max={100}
                        defaultValue={75}
                        unitSuffix="%"
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <div x-data="{ value: 1 }">
                      <FormControl inputName="woodMinQuantity">
                        <Input
                          type="number"
                          name="woodMinQuantity"
                          min={1}
                          x-model="value"
                          size="small"
                        />
                      </FormControl>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div x-data="{ value: 3 }">
                      <FormControl inputName="woodMaxQuantity">
                        <Input
                          type="number"
                          name="woodMaxQuantity"
                          min={1}
                          size="small"
                          x-model="value"
                        />
                      </FormControl>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="danger" size="small">Delete</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>

          <div className="mt-8 mb-4">
            <Text variant="h3" className="text-lg font-semibold">
              Rewards
            </Text>
            <Text variant="body" className="text-text-500 dark:text-text-400">
              Rewards that players can earn from this action
            </Text>
          </div>

          <Form
            hx-post={`/api/servers/${serverId}/actions/${actionId}/rewards`}
            hx-swap="none"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Type</TableCell>
                  <TableCell isHeader>Drop Rate (%)</TableCell>
                  <TableCell isHeader>Min Amount</TableCell>
                  <TableCell isHeader>Max Amount</TableCell>
                  <TableCell isHeader align="right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody colSpan={5}>
                <TableRow hoverable>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span role="img" aria-label="Experience">⭐</span>
                      <span>Experience</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <FormControl inputName="expDropRate">
                      <Range
                        name="expDropRate"
                        min={0}
                        max={100}
                        defaultValue={75}
                        unitSuffix="%"
                      />
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <div x-data="{ value: 50 }">
                      <FormControl inputName="expMinAmount">
                        <Input
                          type="number"
                          name="expMinAmount"
                          min={1}
                          x-model="value"
                          size="small"
                        />
                      </FormControl>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div x-data="{ value: 100 }">
                      <FormControl inputName="expMaxAmount">
                        <Input
                          type="number"
                          name="expMaxAmount"
                          min={1}
                          x-model="value"
                          size="small"
                        />
                      </FormControl>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="danger" size="small">Delete</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Form>
        </div>
      </Tab>

      {/* History Tab */}
      <Tab tabId="history">
        <Text variant="h3" className="text-xl font-bold mb-6">
          Usage History for {actionName}
        </Text>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>User</TableCell>
              <TableCell isHeader>Timestamp</TableCell>
              <TableCell isHeader>Rewards</TableCell>
              <TableCell isHeader align="right">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody colSpan={4}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} hoverable>
                <TableCell>
                  <div>
                    <Text variant="body" className="font-medium">
                      User #{i}
                    </Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Text
                    variant="body"
                    className="text-sm text-background-600 dark:text-background-300"
                  >
                    {i} hour{i !== 1 ? "s" : ""} ago
                  </Text>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-flex items-center text-xs bg-background-100 dark:bg-background-800 px-2 py-1 rounded">
                      <span role="img" aria-label="Coin" className="mr-1">
                        🪙
                      </span>{" "}
                      10
                    </span>
                    {i % 2 === 0 && (
                      <span className="inline-flex items-center text-xs bg-background-100 dark:bg-background-800 px-2 py-1 rounded">
                        <span role="img" aria-label="Wood" className="mr-1">
                          🪵
                        </span>{" "}
                        2
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Badge variant="default">Completed</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Tab>

      {/* Settings Tab */}
      <Tab tabId="settings">
        <Text variant="h3" className="text-xl font-bold mb-6">
          {actionName} Settings
        </Text>
        <div className="space-y-6">
          <Switch
            name="enableAction"
            initialState
            label="Enable Action"
            variant="success"
          />
          <Switch
            name="requireVerification"
            label="Require Verification"
          />
          <Switch
            name="sendNotifications"
            initialState
            label="Send Notifications"
            variant="success"
          />
        </div>
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
