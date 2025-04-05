// Example CardActions.tsx
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@comp/utils/tailwind.ts";

const cardActionsVariants = cva(
  "flex gap-4",
);

type CardActionsProps =
  & BaseComponentProps
  & VariantProps<typeof cardActionsVariants>;

/**
 * CardActions component provides a standard padded container for action buttons
 * typically placed at the bottom of a Card.
 *
 * @example
 * <Card>
 *   <CardBody>...</CardBody>
 *   <CardActions>
 *     <Button variant="primary">Confirm</Button>
 *     <Button variant="outline">Cancel</Button>
 *   </CardActions>
 * </Card>
 */
export const CardActions: FC<CardActionsProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(cardActionsVariants({ className }))}
      {...props}
    >
      {children}
    </div>
  );
};
