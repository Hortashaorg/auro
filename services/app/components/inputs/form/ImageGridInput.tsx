import { cn } from "@comp/utils/tailwind.ts";
import { cva } from "class-variance-authority";
import type { FC, JSX } from "@kalena/framework";
import { Grid } from "@comp/layout/Grid.tsx";
import { Img } from "@comp/content/Img.tsx";
import { Text } from "@comp/content/Text.tsx";

const imageGridVariants = cva([
  "cursor-pointer",
  "transition-all",
  "duration-200",
  "ease-in-out",
  "relative",
  "aspect-square",
], {
  variants: {
    state: {
      default: [
        "border-2",
        "border-transparent",
        "hover:border-primary-400",
        "dark:hover:border-primary-600",
      ],
      selected: [
        "border-2",
        "border-primary-500",
        "dark:border-primary-400",
        "ring-2",
        "ring-primary-500/20",
        "dark:ring-primary-400/20",
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

export const ImageGridInput: FC<Props> = ({
  className,
  assets,
  value,
  ...props
}: Props) => {
  return (
    <div className={cn("w-full", className)}>
      <input
        type="hidden"
        {...props}
        x-model="selectedAsset"
      />
      <Grid content="small" gap="sm" className="w-full">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={cn(imageGridVariants({
              state: value === asset.id ? "selected" : "default",
            }))}
            x-on:click={`selectedAsset = '${asset.id}'`}
          >
            <Img
              src={asset.url}
              alt={`Asset ${asset.id}`}
              className="h-full w-full"
              fit="cover"
              rounded="md"
            />
          </div>
        ))}
      </Grid>
      <Text
        variant="error"
        className="mt-1 text-sm"
        x-show={`errors['${name}']`}
        x-text={`errors['${name}']`}
      />
    </div>
  );
};
