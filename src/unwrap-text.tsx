import { readInput, outputResult } from "./lib/clipboard";
import { unwrapText } from "./lib/transformers/unwrap";

export default async function Command() {
  const text = await readInput();
  if (!text) return;

  await outputResult(unwrapText(text), "Text unwrapped");
}
