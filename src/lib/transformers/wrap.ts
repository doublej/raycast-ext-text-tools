export function wrapText(text: string, tag: string): string {
  return `<${tag}>${text}</${tag}>`;
}
