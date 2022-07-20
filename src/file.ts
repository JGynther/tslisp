import { rep } from "./repl.ts";
import env from "./env.ts";
import Error from "@utils/error.ts";

const read = (name: string) => {
  try {
    const file = Deno.readTextFileSync(name);
    rep(file, env);
  } catch (error) {
    Error.log(error);
  }
};

const filereader = {
  read,
};

export default filereader;
