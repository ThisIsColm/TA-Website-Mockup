import { Project, Post } from "@/types";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";

// ── Project helpers ──────────────────────────────────────────────
// These functions abstract the data source so swapping to a CMS
// (e.g. Sanity, Contentful, or a headless WP) only requires
// changing the implementation here, not in any page components.

export function getAllProjects(): Project[] {
    return projects.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(count = 5): Project[] {
    return getAllProjects().slice(0, count);
}

// ── Post helpers ─────────────────────────────────────────────────

export function getAllPosts(): Post[] {
    return posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function getPostBySlug(slug: string): Post | undefined {
    return posts.find((p) => p.slug === slug);
}

export function getRecentPosts(count = 3): Post[] {
    return getAllPosts().slice(0, count);
}
