import { LaunchProps } from "@raycast/api";
import { readInput, copyOutput } from "./lib/clipboard";
import { wrapText } from "./lib/transformers/wrap";

export default async function Command(
  props: LaunchProps<{ arguments: { tag: string } }>,
) {
  const { tag } = props.arguments;
  const text = await readInput();
  if (!text) return;

  await copyOutput(wrapText(text, tag), `Wrapped in <${tag}> tags`);
}
