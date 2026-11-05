import { query } from "@anthropic-ai/claude-agent-sdk";
import { homedir } from "os";
import { join } from "path";

const SYSTEM_PROMPT = `You are a text formatting tool. Your ONLY job is to unwrap hard-wrapped text into clean paragraphs.

The input is text copied from a terminal or code editor that has been hard-wrapped at a fixed column width. Lines that are part of the same paragraph have been broken mid-sentence.

Rules:
- Join lines that were broken mid-sentence into flowing paragraphs
- Preserve intentional paragraph breaks (blank lines)
- Preserve list items (lines starting with -, *, or numbers)
- Preserve code blocks (indented blocks or fenced code blocks)
- Remove leading indentation from the terminal/editor
- Do NOT rewrite, summarize, or change any words
- Output ONLY the cleaned text, nothing else`;

export async function unwrapWithClaude(
  text: string,
  model: string,
): Promise<string> {
  const claudePath = join(homedir(), ".local", "bin", "claude");

  const home = homedir();
  const response = query({
    prompt: text,
    options: {
      model,
      systemPrompt: SYSTEM_PROMPT,
      permissionMode: "bypassPermissions",
      maxTurns: 1,
      allowedTools: [],
      cwd: home,
      pathToClaudeCodeExecutable: claudePath,
      env: { ...process.env, HOME: home, PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin" },
    },
  });

  let result = "";
  for await (const message of response) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") result += block.text;
      }
    }
    if (message.type === "result") break;
  }

  return result.trim();
}
