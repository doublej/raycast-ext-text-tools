import { showHUD, Clipboard, getPreferenceValues } from "@raycast/api";
import { execSync } from "child_process";

interface OutputPreferences {
  outputMode?: string;
}

const CMD_PASTE = `osascript -e 'tell application "System Events" to keystroke "v" using {command down}'`;

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

export async function outputResult(
  text: string,
  message: string,
): Promise<void> {
  const { outputMode } = getPreferenceValues<OutputPreferences>();

  if (outputMode === "paste") {
    await Clipboard.copy(text);
    execSync(CMD_PASTE);
    await showHUD(message);
  } else {
    await copyOutput(text, message);
  }
}
