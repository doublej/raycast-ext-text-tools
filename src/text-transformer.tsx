import {
  List,
  ActionPanel,
  Action,
  Clipboard,
  getPreferenceValues,
  Icon,
} from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { useState, useRef, useCallback } from "react";
import { clean } from "./lib/transformers/clean-watermark";
import { unwrapText } from "./lib/transformers/unwrap";
import { unwrapWithClaude } from "./lib/transformers/unwrap-claude";
import { wrapText } from "./lib/transformers/wrap";

interface Preferences {
  model: string;
}

const TAG_PRESETS = [
  "context",
  "document",
  "code",
  "instructions",
  "system",
  "user",
  "assistant",
] as const;

function useClipboard() {
  return usePromise(() => Clipboard.readText());
}

function previewMarkdown(text: string): string {
  return "```\n" + text + "\n```";
}

function cleanMetadata(parts: string[]): string {
  if (parts.length === 0) return "*No changes*";
  return parts.map((p) => `- Removed ${p}`).join("\n");
}

export default function Command() {
  const { model } = getPreferenceValues<Preferences>();
  const { data: clipText, isLoading: clipLoading } = useClipboard();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const aiCache = useRef<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const text = clipText ?? "";

  const cleanResult = text ? clean(text) : { cleaned: "", parts: [] };
  const unwrapResult = text ? unwrapText(text) : "";

  const fetchAi = useCallback(
    async (input: string) => {
      if (aiCache.current !== null) return;
      setAiLoading(true);
      setAiError(null);
      try {
        const result = await unwrapWithClaude(input, model);
        aiCache.current = result;
        setAiResult(result);
      } catch (err) {
        setAiError(String(err));
      } finally {
        setAiLoading(false);
      }
    },
    [model],
  );

  function handleSelectionChange(id: string | null) {
    setSelectedId(id);
    if (id === "unwrap-ai" && text && aiCache.current === null && !aiLoading) {
      fetchAi(text);
    }
  }

  function getDetail(id: string | null): string {
    if (!text) return "*Clipboard is empty*";
    if (!id) return "";

    if (id === "clean-watermark") {
      return (
        previewMarkdown(cleanResult.cleaned) +
        "\n\n" +
        cleanMetadata(cleanResult.parts)
      );
    }
    if (id === "unwrap") return previewMarkdown(unwrapResult);
    if (id === "unwrap-ai") {
      if (aiLoading) return "*Calling Claude...*";
      if (aiError) return `**Error:** ${aiError}`;
      return aiResult
        ? previewMarkdown(aiResult)
        : "*Select to start AI unwrap*";
    }
    if (id.startsWith("tag-")) {
      const tag = id.replace("tag-", "");
      return previewMarkdown(wrapText(text, tag));
    }
    return "";
  }

  function getResultText(id: string): string {
    if (id === "clean-watermark") return cleanResult.cleaned;
    if (id === "unwrap") return unwrapResult;
    if (id === "unwrap-ai") return aiResult ?? "";
    if (id.startsWith("tag-")) return wrapText(text, id.replace("tag-", ""));
    return "";
  }

  const itemLoading = selectedId === "unwrap-ai" && aiLoading;

  return (
    <List
      isShowingDetail
      isLoading={clipLoading || itemLoading}
      onSelectionChange={handleSelectionChange}
    >
      <List.Section title="Transform">
        <List.Item
          id="clean-watermark"
          title="Clean Watermark"
          icon={Icon.Eraser}
          detail={<List.Item.Detail markdown={getDetail("clean-watermark")} />}
          actions={<ItemActions text={getResultText("clean-watermark")} />}
        />
        <List.Item
          id="unwrap"
          title="Unwrap Text"
          icon={Icon.Text}
          detail={<List.Item.Detail markdown={getDetail("unwrap")} />}
          actions={<ItemActions text={getResultText("unwrap")} />}
        />
        <List.Item
          id="unwrap-ai"
          title="Unwrap Text (AI)"
          icon={Icon.Stars}
          detail={<List.Item.Detail markdown={getDetail("unwrap-ai")} />}
          actions={<ItemActions text={getResultText("unwrap-ai")} />}
        />
      </List.Section>
      <List.Section title="Wrap in Tags">
        {TAG_PRESETS.map((tag) => (
          <List.Item
            key={tag}
            id={`tag-${tag}`}
            title={`<${tag}>`}
            icon={Icon.Code}
            detail={<List.Item.Detail markdown={getDetail(`tag-${tag}`)} />}
            actions={<ItemActions text={getResultText(`tag-${tag}`)} />}
          />
        ))}
      </List.Section>
    </List>
  );
}

function ItemActions({ text }: { text: string }) {
  return (
    <ActionPanel>
      <Action.CopyToClipboard title="Copy to Clipboard" content={text} />
      <Action.Paste
        title="Paste to Frontmost App"
        content={text}
        shortcut={{ modifiers: ["cmd", "shift"], key: "enter" }}
      />
    </ActionPanel>
  );
}
