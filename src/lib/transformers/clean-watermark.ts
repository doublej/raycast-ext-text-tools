const ZERO_WIDTH = [
  "\u200b",
  "\u200c",
  "\u200d",
  "\ufeff",
  "\u2060",
  "\u00A0",
  "\u2028",
  "\u2029",
  "\u200A",
  "\u2009",
  "\u2008",
  "\u2007",
  "\u2006",
  "\u2005",
  "\u2004",
  "\u2003",
  "\u2002",
  "\u2001",
  "\u2000",
  "\u180E",
  "\u061C",
  "\u200E",
  "\u200F",
  "\u202A",
  "\u202B",
  "\u202C",
  "\u202D",
  "\u202E",
];

const RTF_PATTERNS = [
  /\\rtf\d+/g,
  /\\ansi/g,
  /\\deff\d+/g,
  /\\deflang\d+/g,
  /\\fonttbl[^}]*}/g,
  /\\colortbl[^}]*}/g,
  /\\f\d+/g,
  /\\fs\d+/g,
  /\\cf\d+/g,
  /\\cb\d+/g,
  /\\highlight\d+/g,
  /\\strike\d*/g,
  /\\par\b/g,
  /\\pard\b/g,
  /\\sa\d+/g,
  /\\sb\d+/g,
  /\\sl\d+/g,
  /\\qc\b/g,
  /\\ql\b/g,
  /\\qr\b/g,
  /\\qj\b/g,
];

const FONT_PATTERNS = [
  /<font[^>]*>/gi,
  /<\/font>/gi,
  /font-family:[^;"'\s]*[;"']?/gi,
  /font-size:[^;"'\s]*[;"']?/gi,
  /font-weight:[^;"'\s]*[;"']?/gi,
  /font-style:[^;"'\s]*[;"']?/gi,
  /color:[^;"'\s]*[;"']?/gi,
];

const FORMATTING_PATTERNS = [
  /background[^;"'\s]*:[^;"'\s]*[;"']?/gi,
  /background-color:[^;"'\s]*[;"']?/gi,
  /style\s*=\s*["'][^"']*["']/gi,
  /class\s*=\s*["'][^"']*["']/gi,
  /<meta[^>]*>/gi,
  /<span[^>]*>/gi,
  /<\/span>/gi,
  /<div[^>]*>/gi,
  /<\/div>/gi,
  /<p[^>]*>/gi,
  /<\/p>/gi,
];

const MARKDOWN_PATTERNS = [/\*\*/g, /__/g, /~~/g, /`/g, /^#{1,6}\s/gm];
const GUID_RE = /[A-F0-9]{8}(?:-[A-F0-9]{4}){3}-[A-F0-9]{12}/gi;
// eslint-disable-next-line no-control-regex
const NON_PRINTABLE = /[^\x09\x0A\x0D\x20-\x7E]+/g;

export function clean(text: string): { cleaned: string; parts: string[] } {
  const parts: string[] = [];
  let t = text;
  const before = t.length;

  t = t.normalize("NFKC");

  const spaced = (t.match(/ —/g) ?? []).length;
  t = t.replace(/ —/g, ",");
  const bare = (t.match(/—/g) ?? []).length;
  t = t.replace(/—/g, ", ");
  if (spaced) parts.push(`${spaced} spaced em-dash`);
  if (bare) parts.push(`${bare} bare em-dash`);

  let zwCount = 0;
  for (const zw of ZERO_WIDTH) {
    const count = t.split(zw).length - 1;
    if (count) {
      zwCount += count;
      t = t.replaceAll(zw, zw === "\u00A0" ? " " : "");
    }
  }
  if (zwCount) parts.push(`${zwCount} zero-width`);

  const ctrl = (t.match(NON_PRINTABLE) ?? []).reduce((a, m) => a + m.length, 0);
  t = t.replace(NON_PRINTABLE, "");
  if (ctrl) parts.push(`${ctrl} control`);

  const guids = (t.match(GUID_RE) ?? []).length;
  t = t.replace(GUID_RE, "");
  if (guids) parts.push(`${guids} guid`);

  let fontCount = 0;
  for (const p of [...RTF_PATTERNS, ...FONT_PATTERNS]) {
    fontCount += (t.match(p) ?? []).length;
    t = t.replace(p, "");
  }
  if (fontCount) parts.push(`${fontCount} font`);

  let fmtCount = 0;
  for (const p of FORMATTING_PATTERNS) {
    fmtCount += (t.match(p) ?? []).length;
    t = t.replace(p, "");
  }
  if (fmtCount) parts.push(`${fmtCount} formatting`);

  let mdCount = 0;
  for (const p of MARKDOWN_PATTERNS) {
    mdCount += (t.match(p) ?? []).length;
    t = t.replace(p, "");
  }
  if (mdCount) parts.push(`${mdCount} markdown`);

  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/[ \t]{2,}/g, " ");
  t = t.trim();

  const removed = before - t.length;
  if (removed) parts.unshift(`${removed} chars`);

  return { cleaned: t, parts };
}
