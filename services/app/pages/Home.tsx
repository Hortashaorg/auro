import { Layout } from "@layouts/Layout.tsx";
import { ButtonLink } from "@comp/ButtonLink.tsx";

export const Home = () => {
  return (
    <Layout title="Deno Hot Dude">
      <div>
        <ButtonLink
          href={`${Deno.env.get("GOOGLE_LOGIN_BASE_URL")}?client_id=${
            Deno.env.get("GOOGLE_CLIENT_ID")
          }&redirect_uri=http://localhost:4000/login&response_type=code&scope=email&access_type=offline&prompt=consent`}
        >
          Login
        </ButtonLink>
      </div>
    </Layout>
  );
};
