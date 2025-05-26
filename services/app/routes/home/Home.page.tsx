import { Layout } from "@layout/Layout.tsx";
import { Title } from "@comp/atoms/typography/index.ts";
import { createRoute, getGlobalContext } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";
import { Alert } from "@comp/molecules/feedback/index.ts";
import { AlertTitle } from "@comp/atoms/feedback/index.ts";

const Home = () => {
  const context = getGlobalContext();
  const isLoggedIn = context.var.isLoggedIn;

  return (
    <Layout title="Home">
      <Title level="h1" className="mb-8">Home page</Title>

      {!isLoggedIn && (
        <Alert variant="warning">
          <AlertTitle variant="warning">Requires Login</AlertTitle>
          You can currently just create a new account with a dummy email to have
          a look around.
        </Alert>
      )}
    </Layout>
  );
};

export const homeRoute = createRoute({
  path: "/",
  component: Home,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
