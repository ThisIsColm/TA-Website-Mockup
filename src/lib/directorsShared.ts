/**
 * Client-safe directors constants and types.
 *
 * Kept separate from `directors.ts` so client components can import these
 * without pulling the SQLite layer into the browser bundle.
 */

/** Hover stills shown either side of the names on /directors. */
export const DIRECTOR_STILL_COUNT = 4;

/** Ghost tag slug — posts with this tag auto-join the Directors column. */
export const DIRECTOR_TAG = "director";

/**
 * Names on /directors link to their `/directors/[slug]` page. Only applies to
 * Ghost-backed directors; roster placeholders stay as plain text.
 */
export const DIRECTOR_PAGES_ENABLED = true;

/**
 * The roster from the design. Any name here without a matching Ghost post shows
 * as a name-only placeholder (no stills), so the page is complete before every
 * director has been tagged in Ghost. Remove a name once its post exists.
 */
export const PLACEHOLDER_DIRECTOR_NAMES = [
    "Trevor Gourley",
    "James Fitzgerald",
    "Edelle Kenny",
    "Louis O’Sullivan",
    "David Willis",
    "Eilís Doherty",
    "Richard Childs",
    "Mark O’Brien",
    "Alex Delap",
    "Jonah M George",
    "Olivia McLaughlin",
] as const;

/** Match names across accent/apostrophe/casing differences between Ghost and the roster. */
export function normalizeDirectorName(name: string): string {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/gi, " ")
        .trim()
        .toLowerCase();
}

/** First name(s) on line 1, surname on line 2 — matches the director detail mockup. */
export function splitDirectorNameLines(name: string): {
    first: string;
    last: string | null;
} {
    const trimmed = name.trim();
    const lastSpace = trimmed.lastIndexOf(" ");
    if (lastSpace <= 0) {
        return { first: trimmed, last: null };
    }
    return {
        first: trimmed.slice(0, lastSpace),
        last: trimmed.slice(lastSpace + 1),
    };
}

export type Director = {
    id: string;
    slug: string;
    name: string;
    /** Hover stills, left column first then right, top to bottom. */
    stills: string[];
    /** No Ghost post behind this name yet — renders without stills or a link. */
    isPlaceholder?: boolean;
};
