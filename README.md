# Text Tools

Clean, unwrap, and wrap clipboard text from Raycast.

## Commands

| Command | Mode | Description |
|---|---|---|
| **Clean Watermark** | no-view | Remove watermarks, formatting, and junk from clipboard text |
| **Unwrap Text** | no-view | Unwrap hard-wrapped clipboard text using heuristics |
| **Unwrap Text (AI)** | no-view | Unwrap hard-wrapped clipboard text using Claude AI |
| **Wrap Clipboard** | no-view | Wrap clipboard content in XML-like tags (takes a tag name argument) |
| **Wrap Selection** | no-view | Wrap selected text in XML-like tags in place (takes a tag name argument) |
| **Text Transformer** | view | Pick a transformation and apply it to text |

## Requirements

The **Unwrap Text (AI)** command requires the [Claude Agent SDK](https://docs.anthropic.com/en/docs/claude-code/sdk) (`claude` CLI) to be installed and authenticated.

## Preferences

| Preference | Default | Description |
|---|---|---|
| AI Model | Claude 3 Haiku | Claude model used by the AI unwrap command |
| Output Mode | Copy to Clipboard | How no-view commands deliver results (copy or paste) |
