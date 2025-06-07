import { getGlobalContext } from "@kalena/framework";
import { queries } from "@package/database";
import { throwError } from "@package/common";

/**
 * Breadcrumb segment type definition
 */
export type BreadcrumbSegment = {
  /**
   * Display label for the breadcrumb
   */
  label: string;
  /**
   * URL for the breadcrumb link
   */
  href: string;
  /**
   * Whether this segment represents the current page (not clickable)
   */
  isLink: boolean;
};

/**
 * Calculate breadcrumb segments from the current context
 *
 * This function analyzes the current route and generates appropriate
 * breadcrumb segments for navigation.
 *
 * @returns Array of breadcrumb segments
 */
export const calculateBreadcrumbSegments = async (): Promise<
  BreadcrumbSegment[]
> => {
  const context = getGlobalContext();
  const currentPath = context.req.path;
  const urlSegments = currentPath.split("/").filter((segment) =>
    segment !== ""
  );

  const match = context.req.matchedRoutes.find((route) => route.path !== "/*");
  if (!match) throw new Error("No match found");

  const pathSegments = match.path.split("/").filter((segment) =>
    segment !== ""
  );

  const segments = await Promise.all(pathSegments
    .map(async (segment, index) => {
      const href = "/" + urlSegments.slice(0, index + 1).join("/");

      let label = segment === "" ? "Home" : segment;

      switch (segment) {
        case ":gameId": {
          const gameId = urlSegments[index] ??
            throwError("Game ID not found");

          const game = await queries.games.getGameById(gameId);
          label = game.name;
          break;
        }

        case ":actionId": {
          const actionId = urlSegments[index] ??
            throwError("Action ID not found");

          const action = await queries.actions.getActionById(actionId);
          label = action.name;
          break;
        }
      }

      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href,
        isLink: index !== pathSegments.length - 1,
      };
    }));

  return [
    {
      label: "Home",
      href: "/",
      isLink: segments.length > 0,
    },
    ...segments,
  ];
};
