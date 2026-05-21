/**
 * Default + hover portrait paths for About page team cards.
 * `_001` is default; `_002` is shown on hover.
 */

/** When `_002` was exported as PNG instead of WebP. */
const HOVER_PNG_PREFIXES = new Set([
    "AJ",
    "Beatriz",
    "Eilis",
    "Leon",
    "Mark",
    "Rosie",
]);

export function getTeamPhotoPair(prefix: string): [string, string] {
    const hoverExt = HOVER_PNG_PREFIXES.has(prefix) ? "png" : "webp";
    return [
        `/images/team/${prefix}_001.webp`,
        `/images/team/${prefix}_002.${hoverExt}`,
    ];
}

/** Author bylines / insight headers — first frame only. */
export function getTeamPhotoDefault(prefix: string): string {
    return `/images/team/${prefix}_001.webp`;
}
