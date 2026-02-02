import { showHUD, Clipboard } from "@raycast/api";
import { execSync } from "child_process";

const CMD_COPY = `osascript -e 'tell application "System Events" to keystroke "c" using {command down}'`;
const CMD_PASTE = `osascript -e 'tell application "System Events" to keystroke "v" using {command down}'`;

export async function editInPlace(
  transformFn: (text: string) => string,
  successMsg: string,
): Promise<void> {
  execSync(CMD_COPY);
  await new Promise((r) => setTimeout(r, 150));

  const text = await Clipboard.readText();
  if (!text) {
    await showHUD("No text selected");
    return;
  }

  await Clipboard.copy(transformFn(text));
  execSync(CMD_PASTE);
  await showHUD(successMsg);
}
