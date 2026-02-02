import { readInput, outputResult } from "./lib/clipboard";
import { clean } from "./lib/transformers/clean-watermark";
import { showHUD } from "@raycast/api";

export default async function Command() {
  const text = await readInput();
  if (!text) return;

  const { cleaned, parts } = clean(text);

  if (parts.length === 0) {
    await showHUD("Nothing removed");
    return;
  }

  await outputResult(cleaned, `Removed ${parts.join(", ")}`);
}
