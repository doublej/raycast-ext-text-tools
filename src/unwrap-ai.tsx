import { showToast, Toast, getPreferenceValues } from "@raycast/api";
import { readInput, copyOutput } from "./lib/clipboard";
import { unwrapWithClaude } from "./lib/transformers/unwrap-claude";

interface Preferences {
  model: string;
}

export default async function Command() {
  const { model } = getPreferenceValues<Preferences>();
  const text = await readInput();
  if (!text) return;

  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Unwrapping with Claude...",
  });

  try {
    const result = await unwrapWithClaude(text, model);
    toast.hide();
    await copyOutput(result, "Text unwrapped with AI and copied");
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to unwrap text";
    toast.message = String(err);
  }
}
