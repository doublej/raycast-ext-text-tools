import { readInput, copyOutput } from "./lib/clipboard";
import { unwrapText } from "./lib/transformers/unwrap";

export default async function Command() {
  const text = await readInput();
  if (!text) return;

  await copyOutput(unwrapText(text), "Text unwrapped and copied");
}
