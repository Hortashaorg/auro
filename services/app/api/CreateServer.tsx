import { getContext } from "@context/index.ts";

export const CreateServer = () => {
  const context = getContext();
  const data = context.req.formData();
  console.log(data);

  return <p>response</p>;
};
