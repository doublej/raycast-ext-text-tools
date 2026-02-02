import {
  Form,
  ActionPanel,
  Action,
  Clipboard,
  showHUD,
  showToast,
  Toast,
  getPreferenceValues,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState } from "react";
import { clean } from "./lib/transformers/clean-watermark";
import { unwrapText } from "./lib/transformers/unwrap";
import { unwrapWithClaude } from "./lib/transformers/unwrap-claude";

interface Preferences {
  model: string;
}

type TransformId = "clean-watermark" | "unwrap" | "unwrap-ai";

const TRANSFORMS: { id: TransformId; title: string }[] = [
  { id: "clean-watermark", title: "Clean Watermark" },
  { id: "unwrap", title: "Unwrap Text" },
  { id: "unwrap-ai", title: "Unwrap Text (AI)" },
];

async function transform(
  id: TransformId,
  text: string,
  model: string,
): Promise<string> {
  switch (id) {
    case "clean-watermark":
      return clean(text).cleaned;
    case "unwrap":
      return unwrapText(text);
    case "unwrap-ai":
      return unwrapWithClaude(text, model);
  }
}

export default function Command() {
  const { model } = getPreferenceValues<Preferences>();
  const { data: clipboardText } = usePromise(() => Clipboard.readText());
  const [transformId, setTransformId] =
    useState<TransformId>("clean-watermark");

  async function handleSubmit(values: { text: string }) {
    const { text } = values;
    if (!text.trim()) {
      await showHUD("No text to transform");
      return;
    }

    if (transformId === "unwrap-ai") {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Transforming...",
      });
      try {
        const result = await transform(transformId, text, model);
        await Clipboard.copy(result);
        toast.hide();
        await showHUD("Transformed and copied");
      } catch (err) {
        toast.style = Toast.Style.Failure;
        toast.title = "Transform failed";
        toast.message = String(err);
      }
    } else {
      const result = await transform(transformId, text, model);
      await Clipboard.copy(result);
      await showHUD("Transformed and copied");
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Transform" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="transform"
        title="Transformation"
        value={transformId}
        onChange={(v) => setTransformId(v as TransformId)}
      >
        {TRANSFORMS.map((t) => (
          <Form.Dropdown.Item key={t.id} value={t.id} title={t.title} />
        ))}
      </Form.Dropdown>
      <Form.TextArea
        id="text"
        title="Text"
        placeholder="Paste or type text here"
        defaultValue={clipboardText ?? ""}
      />
    </Form>
  );
}
