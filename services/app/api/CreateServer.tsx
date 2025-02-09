import { getContext } from "@context/index.ts";
import { v } from "@package/framework";
export const CreateServer = () => {
  const context = getContext();

  const data = context.req.valid("form") as v.SafeParseResult<
    typeof CreateServerSchema
  >;

  console.log(data);

  return <p>response</p>;
};

export const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
});
