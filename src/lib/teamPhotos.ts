/**
 * Default + hover portrait paths for About page team cards.
 * `_001` is default; `_002` is shown on hover.
 */

export function getTeamPhotoPair(prefix: string): [string, string] {
    return [
        `/images/team/${prefix}_001.webp`,
        `/images/team/${prefix}_002.webp`,
    ];
}

/** Author bylines / insight headers — first frame only. */
export function getTeamPhotoDefault(prefix: string): string {
    return `/images/team/${prefix}_001.webp`;
}
