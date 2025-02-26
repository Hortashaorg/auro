import { getGlobalContext } from "@kalena/framework";
import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";

type Props = {
  /**
   * Optional className for styling
   */
  className?: string;
};

/**
 * Breadcrumbs component for displaying navigation hierarchy
 *
 * Features:
 * - Automatically generates breadcrumbs from the current path
 * - Proper href aggregation for nested routes
 * - Visually distinct design with chevron separators
 * - Accessible with proper ARIA attributes
 * - Special handling for home page to avoid redundancy
 * - Always displays at least the Home item for consistent layout
 * - Designed to work well within the application's navigation structure
 *
 * @example
 * <Breadcrumbs />
 */
export const Breadcrumbs: FC<Props> = async ({
  className,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const context = getGlobalContext();
  const currentPath = context.req.path;
  const pathSegments = currentPath.split("/");

  // Check if we're on the home page
  const isHomePage = currentPath === "/" || currentPath === "";

  const match = context.req.matchedRoutes.find((route) => route.path !== "/*");
  if (!match) throw new Error("No match found");

  // Create segments with properly aggregated hrefs
  let segments = match.path.split("/").map((segment, index) => {
    // Build the href by joining all segments up to this point
    const href = index === 0
      ? "/"
      : "/" + pathSegments.slice(1, index + 1).join("/");

    return {
      label: segment === ""
        ? "Home"
        : segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
      isActive: index === match.path.split("/").length - 1,
    };
  });

  // If we're on the home page, only show one "Home" item
  if (isHomePage && segments.length > 1) {
    segments = segments.slice(0, 1);
  }

  // Always ensure we have at least the Home item
  if (segments.length === 0) {
    segments = [{
      label: "Home",
      href: "/",
      isActive: true,
    }];
  }

  return (
    <div className={cn("flex items-center", className)}>
      {segments.map((segment, index) => (
        <div key={segment.href} className="flex items-center">
          {index > 0 && (
            <svg
              className="mx-1.5 h-3.5 w-3.5 flex-shrink-0 text-text-400 dark:text-text-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          )}

          {segment.isActive
            ? (
              <span
                className="font-medium text-text-800 dark:text-text-200"
                aria-current="page"
              >
                {segment.label}
              </span>
            )
            : (
              <a
                href={segment.href}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
              >
                {segment.label}
              </a>
            )}
        </div>
      ))}
    </div>
  );
};
