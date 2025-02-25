import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Label } from "@comp/inputs/form/Label.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";

export const CreateServerForm = () => {
  return (
    <Form
      hx-post="/api/create-server"
      hx-swap="none"
    >
      <div className="space-y-4">
        <div>
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
        </div>

        <Button type="submit" variant="primary" className="mt-4">
          Create Server
        </Button>
      </div>
    </Form>
  );
};
