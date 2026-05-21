/** Stop-motion frames for insights list title underlines. */
export const INSIGHTS_TITLE_SQUIGGLE_FRAMES = [
    "/images/Squiggles/Squiggle_01.png",
    "/images/Squiggles/Squiggle_02.png",
    "/images/Squiggles/Squiggle_03.png",
] as const;

/** Source asset dimensions @ 1x — used to scale underlines to text width. */
export const INSIGHTS_SQUIGGLE_ASPECT = {
    width: 1530,
    height: 248,
    /** Each PNG contains two stacked squiggle bands (for two-line titles). */
    bands: 2,
} as const;

export const INSIGHTS_TITLE_SQUIGGLE_FRAME_MS = 400;
