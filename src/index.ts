import repl from "./repl.ts";
import filereader from "./file.ts";

// TODO: clean this up
if (Deno.args[0]) {
  filereader.read(Deno.args[0]);
} else {
  repl.start();
}
