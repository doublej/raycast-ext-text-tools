import { LaunchProps } from "@raycast/api";
import { editInPlace } from "./lib/edit-in-place";
import { wrapText } from "./lib/transformers/wrap";

export default async function Command(
  props: LaunchProps<{ arguments: { tag: string } }>,
) {
  const { tag } = props.arguments;
  await editInPlace((text) => wrapText(text, tag), `Wrapped in <${tag}> tags`);
}
