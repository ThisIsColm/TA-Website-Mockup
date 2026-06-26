import { getPostMetadata } from "@/lib/db";

/** Site-facing insight title — custom override or Ghost default. */
export function getInsightDisplayTitle(postId: string, ghostTitle: string): string {
    const custom = getPostMetadata(postId)?.insightTitle?.trim();
    return custom || ghostTitle;
}
