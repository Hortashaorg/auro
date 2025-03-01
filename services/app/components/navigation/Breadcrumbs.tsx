import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BreadcrumbSegment } from "@queries/breadcrumbs.ts";

type Props = {
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Breadcrumb segments to display
   */
  segments: BreadcrumbSegment[];
};

/**
 * Breadcrumbs component for displaying navigation hierarchy
 *
 * Features:
 * - Visually distinct design with chevron separators
 * - Accessible with proper ARIA attributes
 * - Designed to work well within the application's navigation structure
 *
 * @example
 * // Using with the utility function from queries
 * import { calculateBreadcrumbSegments } from "@queries/breadcrumbs.ts";
 * <Breadcrumbs segments={calculateBreadcrumbSegments()} />
 *
 * // Or with custom segments
 * <Breadcrumbs segments={[
 *   { label: "Home", href: "/", isLink: true },
 *   { label: "Products", href: "/products", isLink: false }
 * ]} />
 */
export const Breadcrumbs: FC<Props> = ({
  className,
  segments,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex flex-wrap items-center">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2 h-3 w-3 flex-shrink-0 text-text-400"
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

            {segment.isLink
              ? (
                <a
                  href={segment.href}
                  className="dark:text-primary-100 dark:hover:text-primary-300 transition-colors underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded px-1"
                >
                  {segment.label}
                </a>
              )
              : (
                <span
                  className="font-medium text-text-100 px-1"
                  aria-current="page"
                >
                  {segment.label}
                </span>
              )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
