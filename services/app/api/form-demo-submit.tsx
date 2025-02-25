import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";

/**
 * API endpoint for handling form demo submissions
 * This endpoint can be deleted after testing
 */
const FormDemoSubmit = async () => {
  const context = formDemoSubmitRoute.context();
  const formData = await context.req.formData();

  // Log each form field
  console.log("Form Demo Submission:");
  console.log("-------------------");

  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  console.log("-------------------");

  return <p>Success</p>;
};

export const formDemoSubmitRoute = createRoute({
  path: "/api/form-demo-submit",
  component: FormDemoSubmit,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
});
