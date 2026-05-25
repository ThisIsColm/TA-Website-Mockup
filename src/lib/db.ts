/**
 * SQLite persistence for curation selections.
 *
 * Stores ordered lists of Ghost post IDs per section key.
 * Schema is extensible for future sections/pages.
 */

import Database from "better-sqlite3";
import path from "path";
import type { CreditEntry } from "@/lib/credits";
import { parseCreditsJson, serializeCreditsJson } from "@/lib/credits";

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
            agency TEXT,
            client TEXT,
            credits_col3 TEXT,
            credits_col5 TEXT,
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);

    migratePostMetadataColumns(db);

    return db;
}

function migratePostMetadataColumns(database: Database.Database): void {
    const cols = database
        .prepare("PRAGMA table_info(post_metadata)")
        .all() as { name: string }[];
    const names = new Set(cols.map((c) => c.name));

    if (!names.has("credits_col3")) {
        database.exec("ALTER TABLE post_metadata ADD COLUMN credits_col3 TEXT");
    }
    if (!names.has("agency")) {
        database.exec("ALTER TABLE post_metadata ADD COLUMN agency TEXT");
    }
    if (!names.has("credits_col5")) {
        database.exec("ALTER TABLE post_metadata ADD COLUMN credits_col5 TEXT");
    }
    if (!names.has("insight_author_id")) {
        database.exec("ALTER TABLE post_metadata ADD COLUMN insight_author_id TEXT");
    }
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
    agency?: string;
    client?: string;
    creditsCol3?: CreditEntry[];
    creditsCol5?: CreditEntry[];
    insightAuthorId?: string;
    updatedAt?: string;
}

type MetadataRow = {
    post_id: string;
    director: string | null;
    agency: string | null;
    client: string | null;
    credits_col3: string | null;
    credits_col5: string | null;
    insight_author_id: string | null;
    updated_at: string;
};

function rowToMetadata(row: MetadataRow): PostMetadata {
    return {
        postId: row.post_id,
        director: row.director || undefined,
        agency: row.agency || undefined,
        client: row.client || undefined,
        creditsCol3: parseCreditsJson(row.credits_col3),
        creditsCol5: parseCreditsJson(row.credits_col5),
        insightAuthorId: row.insight_author_id || undefined,
        updatedAt: row.updated_at,
    };
}

export function getPostMetadata(postId: string): PostMetadata | null {
    const row = getDb()
        .prepare(
            `SELECT post_id, director, agency, client, credits_col3, credits_col5,
                    insight_author_id, updated_at
             FROM post_metadata WHERE post_id = ?`
        )
        .get(postId) as MetadataRow | undefined;

    if (!row) {
        return null;
    }

    return rowToMetadata(row);
}

export function savePostMetadata(
    postId: string,
    metadata: {
        director?: string;
        agency?: string;
        client?: string;
        creditsCol3?: CreditEntry[];
        creditsCol5?: CreditEntry[];
        insightAuthorId?: string | null;
    }
): void {
    const existing = getPostMetadata(postId);

    const defaultDirector =
        metadata.director !== undefined ? metadata.director || null : existing?.director ?? null;
    const defaultAgency =
        metadata.agency !== undefined ? metadata.agency || null : existing?.agency ?? null;
    const defaultClient =
        metadata.client !== undefined ? metadata.client || null : existing?.client ?? null;
    const creditsCol3 =
        metadata.creditsCol3 !== undefined
            ? serializeCreditsJson(metadata.creditsCol3)
            : existing?.creditsCol3
              ? serializeCreditsJson(existing.creditsCol3)
              : null;
    const creditsCol5 =
        metadata.creditsCol5 !== undefined
            ? serializeCreditsJson(metadata.creditsCol5)
            : existing?.creditsCol5
              ? serializeCreditsJson(existing.creditsCol5)
              : null;
    const insightAuthorId =
        metadata.insightAuthorId !== undefined
            ? metadata.insightAuthorId || null
            : existing?.insightAuthorId ?? null;

    getDb()
        .prepare(
            `INSERT INTO post_metadata (post_id, director, agency, client, credits_col3, credits_col5, insight_author_id, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
             ON CONFLICT(post_id)
             DO UPDATE SET director = excluded.director,
                           agency = excluded.agency,
                           client = excluded.client,
                           credits_col3 = excluded.credits_col3,
                           credits_col5 = excluded.credits_col5,
                           insight_author_id = excluded.insight_author_id,
                           updated_at = excluded.updated_at`
        )
        .run(
            postId,
            defaultDirector,
            defaultAgency,
            defaultClient,
            creditsCol3,
            creditsCol5,
            insightAuthorId
        );
}
