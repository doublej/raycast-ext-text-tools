const LIST_RE = /^(\s*[-*]|\s*\d+\.)\s/;
const TERMINATOR_RE = /[.!?:]$/;

function stripCommonIndent(lines: string[]): string[] {
  const nonEmpty = lines.filter((l) => l.trimEnd().length > 0);
  if (nonEmpty.length === 0) return lines;

  const minIndent = Math.min(
    ...nonEmpty.map((l) => l.match(/^(\s*)/)?.[1].length ?? 0),
  );
  if (minIndent === 0) return lines;

  return lines.map((l) => l.slice(minIndent));
}

function isCodeBlock(lines: string[]): boolean {
  return lines.every((l) => l.trimEnd().length === 0 || /^\s{4,}/.test(l));
}

function isListBlock(lines: string[]): boolean {
  return lines.length > 0 && LIST_RE.test(lines[0]);
}

function shouldJoin(prev: string, next: string): boolean {
  if (LIST_RE.test(next)) return false;
  if (next.startsWith("#")) return false;

  const prevTrimmed = prev.trimEnd();
  if (!TERMINATOR_RE.test(prevTrimmed)) return true;

  const firstChar = next.trimStart().charAt(0);
  return (
    firstChar === firstChar.toLowerCase() &&
    firstChar !== firstChar.toUpperCase()
  );
}

function unwrapBlock(lines: string[]): string {
  const parts: string[] = [lines[0].trim()];

  for (let i = 1; i < lines.length; i++) {
    const prev = parts[parts.length - 1];
    const curr = lines[i].trim();
    if (curr.length === 0) continue;

    if (shouldJoin(prev, curr)) {
      parts[parts.length - 1] = prev + " " + curr;
    } else {
      parts.push(curr);
    }
  }

  return parts.join("\n");
}

export function unwrapText(text: string): string {
  const normalized = text.replace(/\r\n?/g, "\n");
  const lines = stripCommonIndent(normalized.split("\n"));
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trimEnd().length === 0) {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) blocks.push(current);

  return blocks
    .map((block) => {
      if (isCodeBlock(block)) return stripCommonIndent(block).join("\n");
      const stripped = stripCommonIndent(block);
      if (isListBlock(stripped)) return stripped.join("\n");
      return unwrapBlock(stripped);
    })
    .join("\n\n");
}
