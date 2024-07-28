import { findRelevantContent } from "medusa-ui-sepia";

async function main() {
  const result = await findRelevantContent("I want a wear for cold winters");

  console.dir(result);
  process.exit(0);
}

main();
