import { Embeddings } from "medusa-ui-sepia";

async function main() {
  const embbedings = await Embeddings.create(process.env.DATABASE_URL!, process.env.OPENAI_API_KEY!);

  const result = await embbedings.findRelevantContent("I want a wear for cold winters");

  console.log("findRelevantContent");
  console.dir(result);
  process.exit(0);
}

main();
