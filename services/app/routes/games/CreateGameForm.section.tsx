import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { SelectInput } from "@comp/atoms/form/SelectInput.tsx";
import { schema } from "@package/database";

export const CreateGameForm = () => {
  const options = schema.game.actionRecoveryInterval.enumValues.map((
    value,
  ) => ({
    label: value,
    value,
  }));

  return (
    <Form
      hx-post="/api/games/create-game"
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Choose a unique name for your game"
        >
          <Label htmlFor="game-name" required>Game Name</Label>
          <Input
            id="game-name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={50}
            placeholder="Enter game name"
          />
        </FormControl>

        <FormControl inputName="game-action-recovery-interval">
          <Label htmlFor="game-action-recovery-interval">
            Action Recovery Interval
          </Label>
          <SelectInput
            id="game-action-recovery-interval"
            name="action_recovery_interval"
            options={options}
          />
        </FormControl>

        <Button type="submit" variant="primary" className="mt-4">
          Create Game
        </Button>
      </div>
    </Form>
  );
};
