import { cn } from "@comp/utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";

const imageGridVariants = cva([
  "cursor-pointer",
  "transition-all",
  "duration-200",
  "ease-in-out",
  "relative",
  "aspect-square",
  "overflow-hidden",
  "w-24",
  "h-24",
], {
  variants: {
    state: {
      default: [
        "border-2",
        "border-transparent",
        "hover:border-primary",
        "dark:hover:border-primary-dark",
        "hover:ring-2",
        "hover:ring-primary/20",
        "dark:hover:ring-primary-dark/20",
      ],
      selected: [
        "border-2",
        "border-primary",
        "dark:border-primary-dark",
        "ring-4",
        "ring-primary/30",
        "dark:ring-primary-dark/30",
        "outline",
        "outline-2",
        "outline-primary",
        "dark:outline-primary-dark",
      ],
    },
  },
  defaultVariants: {
    state: "default",
  },
});

type Asset = {
  id: string;
  url: string;
};

type Props = Omit<JSX.IntrinsicElements["input"], "children"> & {
  assets: Asset[];
  name: string;
  value?: string;
  required?: boolean;
};

/**
 * ImageGridInput component for selecting an image from a grid of options
 *
 * Features:
 * - Visual grid of selectable images
 * - Highlights the selected image
 * - Uses Alpine.js for state management
 * - Stores the selected asset ID in a hidden input
 * - Proper dark mode support with visual feedback
 *
 * @example
 * <FormControl inputName="assetId">
 *   <Label htmlFor="asset-select" required>Select an Image</Label>
 *   <ImageGridInput
 *     name="assetId"
 *     id="asset-select"
 *     assets={[
 *       { id: "asset1", url: "/images/asset1.jpg" },
 *       { id: "asset2", url: "/images/asset2.jpg" },
 *       { id: "asset3", url: "/images/asset3.jpg" }
 *     ]}
 *     required
 *   />
 * </FormControl>
 */
export const ImageGridInput: FC<Props> = ({
  className,
  assets,
  value,
  ...props
}: Props) => {
  return (
    <div
      className={cn("w-full", className)}
      x-data={`{
        selectedAsset: '${value || assets[0]?.id || ""}'
      }`}
    >
      <input
        type="hidden"
        {...props}
        x-model="selectedAsset"
      />
      <div className="max-h-64 overflow-y-auto rounded-md border border-outline dark:border-outline-dark p-4">
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={cn(imageGridVariants({
                state: value === asset.id ? "selected" : "default",
              }))}
              x-on:click={`selectedAsset = '${asset.id}'`}
              x-bind:class={`selectedAsset === '${asset.id}' ? '${
                imageGridVariants({ state: "selected" })
              }' : '${imageGridVariants({ state: "default" })}'`}
            >
              <img
                src={asset.url}
                alt={`Asset ${asset.id}`}
                className="h-full w-full"
                fit="cover"
                rounded="md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
