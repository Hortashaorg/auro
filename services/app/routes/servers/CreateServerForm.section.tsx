import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { SelectInput } from "@comp/atoms/form/SelectInput.tsx";
import { schema } from "@package/database";

export const CreateServerForm = () => {
  const options = schema.server.actionRecoveryInterval.enumValues.map((
    value,
  ) => ({
    label: value,
    value,
  }));

  return (
    <Form
      hx-post="/api/servers/create-server"
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Choose a unique name for your server"
        >
          <Label htmlFor="server-name" required>Server Name</Label>
          <Input
            id="server-name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={50}
            placeholder="Enter server name"
          />
        </FormControl>

        <FormControl inputName="server-action-recovery-interval">
          <Label htmlFor="server-action-recovery-interval">
            Action Recovery Interval
          </Label>
          <SelectInput
            id="server-action-recovery-interval"
            name="action_recovery_interval"
            options={options}
          />
        </FormControl>

        <Button type="submit" variant="primary" className="mt-4">
          Create Server
        </Button>
      </div>
    </Form>
  );
};
