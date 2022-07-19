type Error = {
  message: string;
  line?: number;
  code?: string;
};

const create = (err: Error) => {
  const { message, line, code } = err;

  let error = `Error: ${message} \n`;

  if (!code) return error;

  const length = error.length;
  error += "-".repeat(length) + "\n";
  error += `${line} |  ${code}` + "\n";
  error += "-".repeat(length) + "\n";

  return error;
};

const panic = (err: Error) => {
  throw create(err);
};

const log = (err: string) => {
  console.error(`%c${err}`, "color: red");
};

const Error = { panic, create, log };

export default Error;