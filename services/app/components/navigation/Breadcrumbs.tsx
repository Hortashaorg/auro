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
              <i data-lucide="chevron-right" width={16} height={16}></i>
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
