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
      aria-label="breadcrumb"
      className={cn(
        "text-sm font-medium text-on-surface dark:text-on-surface-dark",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1">
            {index > 0 && (
              <i data-lucide="chevron-right" width={16} height={16}></i>
            )}

            {segment.isLink
              ? (
                <a
                  href={segment.href}
                  className="hover:text-on-surface-strong dark:hover:text-on-surface-dark-strong"
                >
                  {segment.label}
                </a>
              )
              : (
                <span
                  className="text-on-surface-strong font-bold dark:text-on-surface-dark-strong"
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
