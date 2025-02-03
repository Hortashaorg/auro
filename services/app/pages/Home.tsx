import { Layout } from "@layouts/Layout.tsx";
import { ButtonLink } from "@comp/ButtonLink.tsx";
import { getContext } from "@context/index.ts";

export const Home = () => {
  const context = getContext();
  const url = new URL(context.honoContext.req.url);
  return (
    <Layout title="Deno Hot Dude">
      <div>
        <ButtonLink
          href={`${Deno.env.get("GOOGLE_LOGIN_BASE_URL")}?client_id=${
            Deno.env.get("GOOGLE_CLIENT_ID")
          }&redirect_uri=${url.origin}/login&response_type=code&scope=email&access_type=offline&prompt=consent`}
        >
          Login
        </ButtonLink>
      </div>
    </Layout>
  );
};
