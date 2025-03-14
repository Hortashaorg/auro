import type { FC, JSX } from "@kalena/framework";
type Props = JSX.IntrinsicElements["body"] & {
  title: string;
};
export const BaseLayout: FC<Props> = ({
  title,
  children,
}: Props) => {
  return (
    <html lang="en" id="page">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link
          href="/public/main.css"
          rel="stylesheet"
        />
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
