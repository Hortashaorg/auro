import { FormControl } from "@comp/molecules/form/index.ts";
import {
  Form,
  Input,
  Label,
  Switch,
  Textarea,
} from "@comp/atoms/form/index.ts";
import { ImageGridInput } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";
import { selectResourceAssets } from "@queries/selects/assets/selectResourceAssets.ts";

export const CreateResourceForm = async ({ gameId }: { gameId: string }) => {
  const assets = await selectResourceAssets();

  return (
    <Form
      hx-post={`/api/games/${gameId}/admin/resources/create-resource`}
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Choose a unique name for your resource"
        >
          <Label htmlFor="resource-name" required>Resource Name</Label>
          <Input
            id="resource-name"
            name="name"
            type="text"
            required
            placeholder="Enter resource name"
          />
        </FormControl>

        <FormControl
          inputName="description"
          hint="Provide details about this resource and its uses"
        >
          <Label htmlFor="resource-description">Description</Label>
          <Textarea
            id="resource-description"
            name="description"
            type="text"
            placeholder="Enter resource description"
          />
        </FormControl>

        <FormControl
          inputName="leaderboard"
          hint="Enable leaderboard for this resource"
        >
          <Label htmlFor="leaderboard">Leaderboard</Label>
          <Switch name="leaderboard" />
        </FormControl>

        <FormControl
          inputName="assetId"
          hint="Select an image to represent this resource"
        >
          <Label required>Resource Asset</Label>
          <ImageGridInput
            name="assetId"
            assets={assets}
            required
          />
        </FormControl>
      </div>

      <Button type="submit" variant="primary" className="mt-4">
        Create Resource
      </Button>
    </Form>
  );
};
