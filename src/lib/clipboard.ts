import { showHUD, Clipboard } from "@raycast/api";

export async function readInput(): Promise<string | null> {
  const text = await Clipboard.readText();
  if (!text?.trim()) {
    await showHUD("Clipboard is empty");
    return null;
  }
  return text;
}

export async function copyOutput(text: string, message: string): Promise<void> {
  await Clipboard.copy(text);
  await showHUD(message);
}
