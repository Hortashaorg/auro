import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BreadcrumbSegment } from "@queries/breadcrumbs.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { Link } from "@comp/atoms/buttons/index.ts";

type BreadcrumbsProps = BaseComponentProps & {
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
 * @props
 * - segments: Array of breadcrumb segments to display in the navigation path
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
export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  className,
  segments,
  ...props
}: BreadcrumbsProps) => {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "text-sm font-medium text-on-surface dark:text-on-surface-dark",
        className || "",
      )}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1">
            {index > 0 && (
              <i data-lucide="chevron-right" width={16} height={16}></i>
            )}

            {segment.isLink
              ? (
                <Link
                  href={segment.href}
                >
                  {segment.label}
                </Link>
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
