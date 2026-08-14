const TOKEN_RE =
  /("[^"\\]*"\s*:)|("[^"\\]*")|(-?\d+\.?\d*)|(true|false|null)|([{}[\],])|(\s+)|(.)/g;

export const TOKEN_COLORS = {
  key: "var(--color-code-key)",
  string: "var(--color-code-string)",
  number: "var(--color-code-number)",
  bool: "var(--color-code-bool)",
  punct: "var(--color-code-punct)",
  plain: "var(--color-text-soft)",
} as const;

export type Token = { text: string; color: string };

/**
 * Tokenises a single (possibly truncated mid-stream) line of JSON for
 * syntax-highlight colouring. Regex-based rather than JSON.parse so an
 * unterminated string at the end of a partially-revealed line degrades
 * gracefully via the trailing catch-all group instead of throwing.
 */
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    const color = match[1]
      ? TOKEN_COLORS.key
      : match[2]
        ? TOKEN_COLORS.string
        : match[3]
          ? TOKEN_COLORS.number
          : match[4]
            ? TOKEN_COLORS.bool
            : match[5]
              ? TOKEN_COLORS.punct
              : TOKEN_COLORS.plain;
    tokens.push({ text: match[0], color });
  }
  return tokens;
}
