/**
 * SQLite persistence for curation selections.
 *
 * Stores ordered lists of Ghost post IDs per section key.
 * Schema is extensible for future sections/pages.
 */

import Database from "better-sqlite3";
import path from "path";

// ── Database singleton ───────────────────────────────────────────

let db: Database.Database | null = null;

function getDb(): Database.Database {
    if (db) return db;

    const dbPath = path.join(process.cwd(), "data", "curation.db");
    db = new Database(dbPath);

    // Enable WAL mode for better concurrent read performance
    db.pragma("journal_mode = WAL");

    // Create tables if they don't exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS curation_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_key TEXT UNIQUE NOT NULL,
            ghost_post_ids TEXT NOT NULL DEFAULT '[]',
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS post_metadata (
            post_id TEXT PRIMARY KEY,
            director TEXT,
            client TEXT,
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);

    return db;
}

// ── Public API ───────────────────────────────────────────────────

export interface SectionSelection {
    sectionKey: string;
    ghostPostIds: string[];
    updatedAt: string;
}

/**
 * Get the curated post IDs for a section.
 */
export function getSelections(sectionKey: string): SectionSelection {
    const row = getDb()
        .prepare("SELECT section_key, ghost_post_ids, updated_at FROM curation_sections WHERE section_key = ?")
        .get(sectionKey) as { section_key: string; ghost_post_ids: string; updated_at: string } | undefined;

    if (!row) {
        return { sectionKey, ghostPostIds: [], updatedAt: "" };
    }

    return {
        sectionKey: row.section_key,
        ghostPostIds: JSON.parse(row.ghost_post_ids),
        updatedAt: row.updated_at,
    };
}

/**
 * Save the curated post IDs for a section (upsert).
 */
export function saveSelections(sectionKey: string, ghostPostIds: string[]): void {
    const idsJson = JSON.stringify(ghostPostIds);

    getDb()
        .prepare(
            `INSERT INTO curation_sections (section_key, ghost_post_ids, updated_at)
             VALUES (?, ?, datetime('now'))
             ON CONFLICT(section_key)
             DO UPDATE SET ghost_post_ids = excluded.ghost_post_ids,
                           updated_at = excluded.updated_at`
        )
        .run(sectionKey, idsJson);
}

/**
 * Get all section selections (for admin overview).
 */
export function getAllSelections(): SectionSelection[] {
    const rows = getDb()
        .prepare("SELECT section_key, ghost_post_ids, updated_at FROM curation_sections ORDER BY section_key")
        .all() as { section_key: string; ghost_post_ids: string; updated_at: string }[];

    return rows.map((row) => ({
        sectionKey: row.section_key,
        ghostPostIds: JSON.parse(row.ghost_post_ids),
        updatedAt: row.updated_at,
    }));
}

// ── Metadata API ─────────────────────────────────────────────────

export interface PostMetadata {
    postId: string;
    director?: string;
    client?: string;
    updatedAt?: string;
}

export function getPostMetadata(postId: string): PostMetadata | null {
    const row = getDb()
        .prepare("SELECT post_id, director, client, updated_at FROM post_metadata WHERE post_id = ?")
        .get(postId) as { post_id: string; director: string | null; client: string | null; updated_at: string } | undefined;

    if (!row) {
        return null;
    }

    return {
        postId: row.post_id,
        director: row.director || undefined,
        client: row.client || undefined,
        updatedAt: row.updated_at,
    };
}

export function savePostMetadata(postId: string, metadata: { director?: string; client?: string }): void {
    const defaultDirector = metadata.director || null;
    const defaultClient = metadata.client || null;

    getDb()
        .prepare(
            `INSERT INTO post_metadata (post_id, director, client, updated_at)
             VALUES (?, ?, ?, datetime('now'))
             ON CONFLICT(post_id)
             DO UPDATE SET director = excluded.director,
                           client = excluded.client,
                           updated_at = excluded.updated_at`
        )
        .run(postId, defaultDirector, defaultClient);
}
