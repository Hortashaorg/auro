import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type Props = BaseComponentProps & {
  title: string;
};

/**
 * BaseLayout component for the main layout of the application
 *
 * @Props
 * - title: The title of the page
 *
 * @example
 * <BaseLayout title="My App">
 *   <div>Content</div>
 * </BaseLayout>
 */
export const BaseLayout: FC<Props> = ({
  title,
  children,
}: Props) => {
  return (
    <html lang="en" id="page">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link
          href="/public/main.css"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <title>{title}</title>
      </head>
      <body className="dark:bg-surface-dark bg-surface" x-data="{}">
        {children}
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"
        >
        </script>
        <script src="/public/lucide.js">
        </script>
        <script>
          lucide.createIcons();
        </script>
        <script src="/public/darkmode.js"></script>
      </body>
    </html>
  );
};
