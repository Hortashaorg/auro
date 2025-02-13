import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

const app = new Hono();

app.get("/", (c) => {
  return c.html(
    <html>
      <body>
        <div
          client-state
          zz-request={{
            method: "get",
            url: "/api/hello",
            target: "#hello",
          }}
        >
          <h1>Hello, world!</h1>
        </div>
        <script src="/dist/main.js"></script>
      </body>
    </html>,
  );
});

/** Static Files */
app.use(
  "/dist/*",
  serveStatic({
    root: `/`,
    onNotFound: (path) => {
      console.log("not found file", path);
    },
  }),
);

Deno.serve(app.fetch);
