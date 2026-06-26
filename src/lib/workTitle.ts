import { getPostMetadata } from "@/lib/db";

/** Site-facing work title — custom override or Ghost default. */
export function getWorkDisplayTitle(postId: string, ghostTitle: string): string {
    const custom = getPostMetadata(postId)?.workTitle?.trim();
    return custom || ghostTitle;
}
