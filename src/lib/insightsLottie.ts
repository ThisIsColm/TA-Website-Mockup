/** Public paths to insights Lottie assets (folder name is URL-encoded). */
export const INSIGHTS_COG_LOTTIE =
    "/images/Lottie%20Files/002_Cog%20Rotation_Head_Texture.json";
export const INSIGHTS_EYE_LOTTIE =
    "/images/Lottie%20Files/003_Eye_Texture.json";

/** Playback segment for the eye blink (frames 0–48, 49 frames total). */
export const INSIGHTS_EYE_LOOP_SEGMENT: [number, number] = [0, 49];

type LottieLayer = { ip?: number; op?: number; st?: number };
type LottieData = { ip?: number; op?: number; layers?: LottieLayer[] };

/**
 * AE exports often carry fractional in/out points. Those extra sub-frames sit
 * outside every image layer, so lottie-web renders a blank frame before looping.
 */
export function normalizeLottieLoop(data: LottieData): LottieData {
    data.ip = Math.floor(data.ip ?? 0);
    data.op = Math.floor(data.op ?? 0);

    for (const layer of data.layers ?? []) {
        layer.ip = Math.round(layer.ip ?? 0);
        layer.op = Math.round(layer.op ?? 0);
        layer.st = Math.round(layer.st ?? 0);
    }

    return data;
}
