export interface CreditEntry {
    title: string;
    name: string;
}

/**
 * Parse admin textarea input into credit entries.
 * Each entry is a title line + name line, separated by blank lines.
 * Also accepts a single-line "title, name" pair per block.
 */
export function parseCreditsText(text: string): CreditEntry[] {
    const trimmed = text.trim();
    if (!trimmed) return [];

    const blocks = trimmed.split(/\n\s*\n/);
    const entries: CreditEntry[] = [];

    for (const block of blocks) {
        const lines = block
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
        if (lines.length === 0) continue;

        if (lines.length === 1) {
            const comma = lines[0].indexOf(",");
            if (comma > 0) {
                entries.push({
                    title: lines[0].slice(0, comma).trim(),
                    name: lines[0].slice(comma + 1).trim(),
                });
            }
            continue;
        }

        entries.push({
            title: lines[0],
            name: lines.slice(1).join(" "),
        });
    }

    return entries;
}

export function serializeCreditsText(entries: CreditEntry[] | undefined): string {
    if (!entries?.length) return "";
    return entries.map((e) => `${e.title}\n${e.name}`).join("\n\n");
}

export function parseCreditsJson(json: string | null | undefined): CreditEntry[] {
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter(
                (e): e is CreditEntry =>
                    e &&
                    typeof e === "object" &&
                    typeof e.title === "string" &&
                    typeof e.name === "string"
            )
            .map((e) => ({ title: e.title.trim(), name: e.name.trim() }))
            .filter((e) => e.title && e.name);
    } catch {
        return [];
    }
}

export function serializeCreditsJson(entries: CreditEntry[]): string {
    return JSON.stringify(entries);
}
