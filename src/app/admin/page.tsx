"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { GhostPost, GhostTag } from "@/lib/ghost";
import {
    parseCreditsText,
    serializeCreditsText,
    type CreditEntry,
} from "@/lib/credits";
import { getTeamAuthor, TEAM_AUTHORS } from "@/lib/team";

export type CuratedPost = GhostPost & {
    director?: string;
    agency?: string;
    client?: string;
    creditsCol3?: CreditEntry[];
    creditsCol5?: CreditEntry[];
    insightAuthorId?: string;
    insightTitle?: string;
    previewStartTime?: number;
};

// ── Dashboard sections (single view: Work + Insights) ────────────

export const DASHBOARD_SECTIONS = [
    {
        key: "home.selectedWork",
        title: "Work",
        description: "Homepage project grid — up to 16 projects shown on the site.",
        limit: 16,
        previewHref: "/",
        previewLabel: "View homepage",
        kind: "work" as const,
    },
    {
        key: "case-studies",
        title: "Insights",
        description: "Insights listing page — drag to set order. No limit.",
        limit: null,
        previewHref: "/insights",
        previewLabel: "View insights",
        kind: "insight" as const,
    },
] as const;

export type DashboardSectionKey = (typeof DASHBOARD_SECTIONS)[number]["key"];

const LIMITS: Record<DashboardSectionKey, number | null> = Object.fromEntries(
    DASHBOARD_SECTIONS.map((s) => [s.key, s.limit])
) as Record<DashboardSectionKey, number | null>;

function isAtSectionLimit(sectionKey: DashboardSectionKey, count: number): boolean {
    const limit = LIMITS[sectionKey];
    return limit !== null && count >= limit;
}

function sectionLimitLabel(sectionKey: DashboardSectionKey): string {
    const limit = LIMITS[sectionKey];
    return limit === null ? "∞" : String(limit);
}

const SECTION_BY_KEY = Object.fromEntries(
    DASHBOARD_SECTIONS.map((s) => [s.key, s])
) as Record<DashboardSectionKey, (typeof DASHBOARD_SECTIONS)[number]>;

// ── Styles ───────────────────────────────────────────────────────

const styles = {
    page: "h-full flex flex-col overflow-hidden bg-bg text-text-primary font-sans p-6 md:p-10",
    header: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4 shrink-0",
    title: "text-2xl font-bold tracking-tight text-white",
    subtitle: "text-sm text-text-secondary mt-1 max-w-xl",
    loginCard: "max-w-sm mx-auto mt-[20vh] bg-bg-card p-8 border border-border rounded-lg",
    input:
        "w-full px-4 py-3 bg-bg-elevated border border-border text-white text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors rounded",
    btn: "px-5 py-2.5 bg-accent text-white text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded",
    btnGhost:
        "px-4 py-2 text-xs font-bold text-white/70 border border-white/15 hover:text-white hover:border-white/30 transition-colors rounded",
    btnDanger:
        "px-3 py-1.5 text-red-500/80 text-xs hover:text-red-400 active:scale-[0.98] transition-all",
    card: "bg-bg-card border border-border rounded-lg overflow-hidden",
    badge: "px-2 py-0.5 bg-bg-elevated text-text-secondary text-[10px] border border-border uppercase tracking-wide font-bold",
    badgeWork: "px-2 py-0.5 bg-accent/15 text-accent text-[10px] border border-accent/30 uppercase tracking-wide font-bold",
    badgeInsight:
        "px-2 py-0.5 bg-blue-500/15 text-blue-300 text-[10px] border border-blue-500/30 uppercase tracking-wide font-bold",
    helpBar:
        "mb-4 shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60",
    grid: "flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6",
    postItem:
        "flex items-center gap-3 p-3 transition-colors cursor-grab group border-b border-border/50 bg-bg-card",
    postThumb: "w-16 h-12 bg-bg-elevated object-cover shrink-0 rounded",
    toast: "fixed bottom-6 right-6 px-5 py-3 text-sm font-bold shadow-lg z-50 transition-all rounded-lg",
    sectionHeader: "px-4 py-3 border-b border-border/60 bg-bg-elevated/40",
    sectionTitle: "text-base font-bold text-white",
    sectionDesc: "text-xs text-white/45 mt-0.5 leading-relaxed",
    dropZone: "flex-1 min-h-0 overflow-y-auto",
    emptyDrop:
        "m-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 px-6 py-12 text-center",
};

function getTagName(tag: GhostTag | string): string {
    return typeof tag === "string" ? tag : tag.name;
}

/** Curation API returns tag names as strings; Ghost posts use full tag objects. */
function normalizeCurationTags(
    tags: readonly (GhostTag | string)[] | undefined
): GhostTag[] {
    if (!tags?.length) return [];
    return tags.map((t) =>
        typeof t === "string" ? { id: t, name: t, slug: t } : t
    );
}

/** Shape returned by GET /api/curation/all for each post row */
interface CurationApiPost {
    id: string;
    title: string;
    slug: string;
    url: string;
    feature_image: string | null;
    excerpt: string;
    published_at: string;
    tags: string[];
    director?: string;
    agency?: string;
    client?: string;
    creditsCol3?: CreditEntry[];
    creditsCol5?: CreditEntry[];
    insightAuthorId?: string;
    insightTitle?: string;
    previewStartTime?: number;
    vimeoId?: string;
}

function sectionKind(key: DashboardSectionKey): "work" | "insight" {
    return SECTION_BY_KEY[key].kind;
}

// ── Component ────────────────────────────────────────────────────

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [posts, setPosts] = useState<GhostPost[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [ghostError, setGhostError] = useState("");

    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editDirector, setEditDirector] = useState("");
    const [editAgency, setEditAgency] = useState("");
    const [editClient, setEditClient] = useState("");
    const [editCreditsCol3, setEditCreditsCol3] = useState("");
    const [editCreditsCol5, setEditCreditsCol5] = useState("");
    const [editPreviewStart, setEditPreviewStart] = useState("");
    const [editInsightAuthor, setEditInsightAuthor] = useState("");
    const [editInsightTitle, setEditInsightTitle] = useState("");
    const [editingSectionKey, setEditingSectionKey] = useState<DashboardSectionKey | null>(null);
    const [isSavingMeta, setIsSavingMeta] = useState(false);

    const [selections, setSelections] = useState<Record<DashboardSectionKey, CuratedPost[]>>({
        "home.selectedWork": [],
        "case-studies": [],
    });

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const isInitialMount = useRef(true);
    const [hasLoadedSelections, setHasLoadedSelections] = useState(false);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = async () => {
        setLoginLoading(true);
        setLoginError("");
        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setAuthed(true);
            } else {
                setLoginError("Invalid password");
            }
        } catch {
            setLoginError("Connection error");
        } finally {
            setLoginLoading(false);
        }
    };

    const fetchPosts = useCallback(async (query = "", refresh = false) => {
        setLoading(true);
        setGhostError("");
        try {
            const params = new URLSearchParams();
            if (query) params.set("search", query);
            if (refresh) params.set("refresh", "1");
            params.set("limit", "100");
            const res = await fetch(
                `/api/ghost/posts?${params.toString()}`,
                refresh ? { cache: "no-store" } : undefined
            );
            if (res.status === 401) {
                setAuthed(false);
                return;
            }
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            setPosts(data.posts || []);
            if (refresh) {
                showToast(`Loaded ${data.posts?.length ?? 0} posts from Ghost`);
            }
        } catch (err) {
            setGhostError("Could not load posts from Ghost.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadSelections = useCallback(async () => {
        try {
            const res = await fetch("/api/curation/all");
            if (!res.ok) return;
            const data = await res.json();

            const newSelections: Record<DashboardSectionKey, CuratedPost[]> = {
                "home.selectedWork": [],
                "case-studies": [],
            };

            for (const { key } of DASHBOARD_SECTIONS) {
                if (data[key]?.length) {
                    newSelections[key] = data[key].map((p: CurationApiPost) => ({
                        ...p,
                        tags: normalizeCurationTags(p.tags),
                    })) as CuratedPost[];
                }
            }

            setSelections(newSelections);
            setHasLoadedSelections(true);
        } catch (err) {
            console.error("Failed to load selections:", err);
        }
    }, []);

    const getPostSections = useCallback(
        (postId: string): DashboardSectionKey[] =>
            DASHBOARD_SECTIONS.filter(({ key }) =>
                selections[key].some((p) => p.id === postId)
            ).map(({ key }) => key),
        [selections]
    );

    const openEditPost = (post: CuratedPost, sectionKey: DashboardSectionKey) => {
        setEditingPostId(post.id);
        setEditingSectionKey(sectionKey);
        if (sectionKind(sectionKey) === "insight") {
            setEditInsightAuthor(post.insightAuthorId || "");
            setEditInsightTitle(post.insightTitle || "");
        } else {
            setEditDirector(post.director || "");
            setEditAgency(post.agency || "");
            setEditClient(post.client || "");
            setEditCreditsCol3(serializeCreditsText(post.creditsCol3));
            setEditCreditsCol5(serializeCreditsText(post.creditsCol5));
            setEditPreviewStart(
                post.previewStartTime != null ? String(post.previewStartTime) : ""
            );
        }
    };

    const savePostMeta = async (post: CuratedPost, sectionKey: DashboardSectionKey) => {
        setIsSavingMeta(true);
        const insight = sectionKind(sectionKey) === "insight";
        const trimmedStart = editPreviewStart.trim();
        const parsedStart = trimmedStart === "" ? null : Number(trimmedStart);
        const previewStartTime =
            parsedStart != null && Number.isFinite(parsedStart) && parsedStart >= 0
                ? parsedStart
                : null;
        try {
            const res = await fetch("/api/metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: post.id,
                    data: insight
                        ? {
                              insightAuthorId: editInsightAuthor || null,
                              insightTitle: editInsightTitle.trim() || null,
                          }
                        : {
                              director: editDirector,
                              agency: editAgency,
                              client: editClient,
                              creditsCol3: parseCreditsText(editCreditsCol3),
                              creditsCol5: parseCreditsText(editCreditsCol5),
                              previewStartTime,
                          },
                }),
            });

            if (res.ok) {
                setSelections((prev) => {
                    const updatePost = (p: CuratedPost): CuratedPost =>
                        p.id === post.id
                            ? insight
                                ? {
                                      ...p,
                                      insightAuthorId: editInsightAuthor || undefined,
                                      insightTitle: editInsightTitle.trim() || undefined,
                                  }
                                : {
                                      ...p,
                                      director: editDirector,
                                      agency: editAgency,
                                      client: editClient,
                                      creditsCol3: parseCreditsText(editCreditsCol3),
                                      creditsCol5: parseCreditsText(editCreditsCol5),
                                      previewStartTime: previewStartTime ?? undefined,
                                  }
                            : p;

                    const next = { ...prev };
                    for (const { key } of DASHBOARD_SECTIONS) {
                        next[key] = prev[key].map(updatePost);
                    }
                    return next;
                });
                setEditingPostId(null);
                setEditingSectionKey(null);
                showToast("Details saved");
            } else {
                showToast("Could not save details", "error");
            }
        } catch {
            showToast("Connection error", "error");
        } finally {
            setIsSavingMeta(false);
        }
    };

    const addToSection = (post: GhostPost, sectionKey: DashboardSectionKey) => {
        if (selections[sectionKey].some((p) => p.id === post.id)) {
            showToast(`Already in ${SECTION_BY_KEY[sectionKey].title}`, "error");
            return;
        }
        if (isAtSectionLimit(sectionKey, selections[sectionKey].length)) {
            showToast(
                `${SECTION_BY_KEY[sectionKey].title} is full (${sectionLimitLabel(sectionKey)} max)`,
                "error"
            );
            return;
        }
        setSelections((prev) => ({
            ...prev,
            [sectionKey]: [...prev[sectionKey], post],
        }));
        showToast(`Added to ${SECTION_BY_KEY[sectionKey].title}`);
    };

    const removeFromSection = (postId: string, section: DashboardSectionKey) => {
        setSelections((prev) => ({
            ...prev,
            [section]: prev[section].filter((p) => p.id !== postId),
        }));
    };

    useEffect(() => {
        if (authed) {
            fetchPosts();
            loadSelections();
        }
    }, [authed, fetchPosts, loadSelections]);

    useEffect(() => {
        if (!authed) return;
        const timer = setTimeout(() => fetchPosts(search), 300);
        return () => clearTimeout(timer);
    }, [search, authed, fetchPosts]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            if (source.index === destination.index) return;

            const sectionKey = destination.droppableId as DashboardSectionKey;
            setSelections((prev) => {
                const arr = [...prev[sectionKey]];
                const [removed] = arr.splice(source.index, 1);
                arr.splice(destination.index, 0, removed);
                return { ...prev, [sectionKey]: arr };
            });
            return;
        }

        if (source.droppableId === "library") {
            const post = posts[source.index];
            if (!post) return;

            const destId = destination.droppableId as DashboardSectionKey;

            if (selections[destId].some((p) => p.id === post.id)) {
                showToast(`Already in ${SECTION_BY_KEY[destId].title}`, "error");
                return;
            }

            if (isAtSectionLimit(destId, selections[destId].length)) {
                showToast(
                    `${SECTION_BY_KEY[destId].title} is full (${sectionLimitLabel(destId)} max)`,
                    "error"
                );
                return;
            }

            setSelections((prev) => {
                const arr = [...prev[destId]];
                arr.splice(destination.index, 0, post);
                return { ...prev, [destId]: arr };
            });
            return;
        }

        const sourceId = source.droppableId as DashboardSectionKey;
        const destId = destination.droppableId as DashboardSectionKey;

        if (
            DASHBOARD_SECTIONS.some((s) => s.key === sourceId) &&
            DASHBOARD_SECTIONS.some((s) => s.key === destId)
        ) {
            if (
                isAtSectionLimit(destId, selections[destId].length) &&
                sourceId !== destId
            ) {
                showToast(
                    `${SECTION_BY_KEY[destId].title} is full (${sectionLimitLabel(destId)} max)`,
                    "error"
                );
                return;
            }

            setSelections((prev) => {
                const sourceArr = [...prev[sourceId]];
                const [movedItem] = sourceArr.splice(source.index, 1);
                if (!movedItem) return prev;

                const destArr = [...prev[destId]];
                if (sourceId !== destId && destArr.some((p) => p.id === movedItem.id)) {
                    showToast(`Already in ${SECTION_BY_KEY[destId].title}`, "error");
                    return prev;
                }

                destArr.splice(destination.index, 0, movedItem);

                return {
                    ...prev,
                    [sourceId]: sourceArr,
                    [destId]: destArr,
                };
            });
        }
    };

    const handleSave = useCallback(async () => {
        if (!authed) return;
        setSaving(true);
        try {
            const payload: Record<string, string[]> = {};
            for (const { key } of DASHBOARD_SECTIONS) {
                payload[key] = selections[key].map((p) => p.id);
            }

            const res = await fetch("/api/curation/all", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                setAuthed(false);
                showToast("Session expired — please log in again", "error");
                return;
            }

            if (!res.ok) showToast("Could not save changes", "error");
        } catch {
            showToast("Connection error while saving", "error");
        } finally {
            setSaving(false);
        }
    }, [selections, authed]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!hasLoadedSelections) return;
        const timer = setTimeout(() => handleSave(), 1000);
        return () => clearTimeout(timer);
    }, [selections, handleSave, hasLoadedSelections]);

    if (!authed) {
        return (
            <div className={styles.page}>
                <div className={styles.loginCard}>
                    <h1 className="text-xl font-semibold mb-1">Content Dashboard</h1>
                    <p className="text-sm text-white/50 mb-6">
                        Sign in to manage Work and Insights on the site.
                    </p>
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className={`${styles.input} mb-4`}
                        autoFocus
                    />
                    {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
                    <button
                        onClick={handleLogin}
                        disabled={loginLoading || !password}
                        className={`${styles.btn} w-full`}
                    >
                        {loginLoading ? "Signing in…" : "Sign in"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Content Dashboard</h1>
                    <p className={styles.subtitle}>
                        Drag posts from the Ghost library into Work or Insights. Reorder by
                        dragging within each column. Changes save automatically.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-card border border-border">
                        <div
                            className={`w-2 h-2 rounded-full ${saving ? "bg-accent animate-pulse" : "bg-green-500"}`}
                        />
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            {saving ? "Saving…" : "Saved"}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.helpBar}>
                <strong className="text-white/80">Quick guide:</strong> Search the library → drag
                a post into a column (or use + Work / + Insights). Click a post to edit project
                details or insight author. Drag between columns to move content.
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={`${styles.grid} min-h-0`}>
                    {/* ── Ghost library ───────────────────────────────────── */}
                    <div className="lg:col-span-1 flex flex-col min-h-0 h-full">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-white">Ghost library</h2>
                                <p className="text-xs text-white/40 mt-1">
                                    All published posts from Ghost CMS
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => fetchPosts(search, true)}
                                disabled={loading}
                                className={`${styles.btnGhost} shrink-0`}
                            >
                                {loading ? "Refreshing…" : "Refresh from Ghost"}
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${styles.input} mb-3`}
                        />

                        {ghostError && (
                            <div className="bg-red-500/10 border border-red-500/30 p-4 mb-3 text-sm text-red-300 rounded-lg">
                                {ghostError}
                            </div>
                        )}

                        <div
                            className={`${styles.card} flex-1 min-h-0 overflow-y-auto`}
                            data-lenis-prevent
                        >
                            <Droppable droppableId="library" isDropDisabled={true}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-full"
                                    >
                                        {loading ? (
                                            <div className="p-8 text-center text-white/30 text-sm">
                                                Loading posts…
                                            </div>
                                        ) : posts.length === 0 ? (
                                            <div className="p-8 text-center text-white/30 text-sm">
                                                No posts match your search
                                            </div>
                                        ) : (
                                            posts.map((post, index) => {
                                                const inSections = getPostSections(post.id);

                                                return (
                                                    <Draggable
                                                        key={`lib-${post.id}`}
                                                        draggableId={`lib-${post.id}`}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`${styles.postItem} ${snapshot.isDragging ? "bg-accent/20 border-accent/50 z-50 shadow-2xl" : "hover:bg-bg-elevated"}`}
                                                            >
                                                                {post.feature_image ? (
                                                                    <img
                                                                        src={post.feature_image}
                                                                        alt=""
                                                                        className={styles.postThumb}
                                                                    />
                                                                ) : (
                                                                    <div className={styles.postThumb} />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">
                                                                        {post.title}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                                        {inSections.includes(
                                                                            "home.selectedWork"
                                                                        ) && (
                                                                            <span className={styles.badgeWork}>
                                                                                Work
                                                                            </span>
                                                                        )}
                                                                        {inSections.includes(
                                                                            "case-studies"
                                                                        ) && (
                                                                            <span
                                                                                className={
                                                                                    styles.badgeInsight
                                                                                }
                                                                            >
                                                                                Insights
                                                                            </span>
                                                                        )}
                                                                        {post.tags
                                                                            ?.slice(0, 1)
                                                                            .map((tag, i) => (
                                                                                <span
                                                                                    key={i}
                                                                                    className={
                                                                                        styles.badge
                                                                                    }
                                                                                >
                                                                                    {getTagName(tag)}
                                                                                </span>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            addToSection(
                                                                                post,
                                                                                "home.selectedWork"
                                                                            );
                                                                        }}
                                                                        className="px-2 py-1 text-[10px] font-bold text-accent bg-accent/10 hover:bg-accent/20 rounded"
                                                                    >
                                                                        + Work
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            addToSection(
                                                                                post,
                                                                                "case-studies"
                                                                            );
                                                                        }}
                                                                        className="px-2 py-1 text-[10px] font-bold text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded"
                                                                    >
                                                                        + Insights
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>

                    {/* ── Work + Insights columns ─────────────────────────── */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 h-full">
                        {DASHBOARD_SECTIONS.map(
                            ({ key, title, description, previewHref, previewLabel, kind }) => (
                                <div key={key} className="flex flex-col min-h-0 h-full">
                                    <div className={`${styles.card} flex flex-col flex-1 min-h-0`}>
                                        <div className={`${styles.sectionHeader} shrink-0`}>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h2 className={styles.sectionTitle}>
                                                        {title}{" "}
                                                        <span className="text-white/30 font-normal text-sm">
                                                            ({selections[key].length}
                                                            {LIMITS[key] !== null
                                                                ? `/${LIMITS[key]}`
                                                                : ""}
                                                            )
                                                        </span>
                                                    </h2>
                                                    <p className={styles.sectionDesc}>
                                                        {description}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={previewHref}
                                                    target="_blank"
                                                    className={`${styles.btnGhost} shrink-0`}
                                                >
                                                    {previewLabel}
                                                </Link>
                                            </div>
                                        </div>

                                        <Droppable droppableId={key}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`${styles.dropZone} ${snapshot.isDraggingOver ? "bg-accent/5" : ""}`}
                                                    data-lenis-prevent
                                                >
                                                    {selections[key].length === 0 && (
                                                        <div className={styles.emptyDrop}>
                                                            <p className="text-sm text-white/50 font-medium">
                                                                Drop posts here
                                                            </p>
                                                            <p className="text-xs text-white/30 mt-2 max-w-[220px]">
                                                                Drag from the library, or use the +
                                                                buttons on each post
                                                            </p>
                                                        </div>
                                                    )}

                                                    {selections[key].map((post, i) => {
                                                        const insight = kind === "insight";
                                                        const metaPreview = [
                                                            post.director &&
                                                                `Dir: ${post.director}`,
                                                            post.agency &&
                                                                `Agency: ${post.agency}`,
                                                            post.client &&
                                                                `Client: ${post.client}`,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" · ");

                                                        return (
                                                            <Draggable
                                                                key={`${key}-${post.id}`}
                                                                draggableId={`${key}-${post.id}`}
                                                                index={i}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        className="flex flex-col border-b border-border/50"
                                                                    >
                                                                        <div
                                                                            {...provided.dragHandleProps}
                                                                            onClick={() =>
                                                                                openEditPost(
                                                                                    post,
                                                                                    key
                                                                                )
                                                                            }
                                                                            className={`flex items-center gap-3 p-3 transition-colors group bg-bg-card cursor-grab ${snapshot.isDragging ? "bg-accent/20 z-50 shadow-2xl border border-accent" : "hover:bg-bg-elevated"}`}
                                                                        >
                                                                            <span className="text-xs text-white/30 w-5 shrink-0 text-center font-mono">
                                                                                {i + 1}
                                                                            </span>
                                                                            {post.feature_image ? (
                                                                                <img
                                                                                    src={
                                                                                        post.feature_image
                                                                                    }
                                                                                    alt=""
                                                                                    className={
                                                                                        styles.postThumb
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <div
                                                                                    className={
                                                                                        styles.postThumb
                                                                                    }
                                                                                />
                                                                            )}
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-sm font-medium truncate">
                                                                                    {post.insightTitle ||
                                                                                        post.title}
                                                                                </p>
                                                                                {insight &&
                                                                                post.insightTitle ? (
                                                                                    <p className="text-xs text-white/25 truncate mt-0.5">
                                                                                        Ghost: {post.title}
                                                                                    </p>
                                                                                ) : null}
                                                                                {insight &&
                                                                                post.insightAuthorId ? (
                                                                                    <p className="text-xs text-text-tertiary truncate mt-0.5">
                                                                                        By{" "}
                                                                                        {getTeamAuthor(
                                                                                            post.insightAuthorId
                                                                                        )?.name ??
                                                                                            post.insightAuthorId}
                                                                                    </p>
                                                                                ) : null}
                                                                                {!insight &&
                                                                                metaPreview ? (
                                                                                    <p className="text-xs text-text-tertiary truncate mt-0.5">
                                                                                        {metaPreview}
                                                                                    </p>
                                                                                ) : null}
                                                                                {!insight &&
                                                                                !metaPreview ? (
                                                                                    <p className="text-xs text-white/25 mt-0.5">
                                                                                        Click to add
                                                                                        details
                                                                                    </p>
                                                                                ) : null}
                                                                            </div>
                                                                            <div className="flex items-center gap-1 shrink-0">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        openEditPost(
                                                                                            post,
                                                                                            key
                                                                                        );
                                                                                    }}
                                                                                    className="px-2.5 py-1 text-green-400/90 text-xs hover:text-green-300 bg-bg-elevated rounded"
                                                                                >
                                                                                    Edit
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        removeFromSection(
                                                                                            post.id,
                                                                                            key
                                                                                        );
                                                                                    }}
                                                                                    className={`${styles.btnDanger} px-2 py-1 bg-bg-elevated rounded`}
                                                                                    title="Remove"
                                                                                >
                                                                                    ✕
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        {editingPostId === post.id &&
                                                                            editingSectionKey ===
                                                                                key && (
                                                                                <div className="p-4 bg-bg-elevated flex flex-col gap-4 border-t border-border/40">
                                                                                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">
                                                                                        {insight
                                                                                            ? "Insight details"
                                                                                            : "Project details"}
                                                                                    </p>

                                                                                    {insight ? (
                                                                                        <>
                                                                                            <div>
                                                                                                <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                    TITLE
                                                                                                </label>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className={`${styles.input} !py-2`}
                                                                                                    value={editInsightTitle}
                                                                                                    onKeyDown={(e) =>
                                                                                                        e.key ===
                                                                                                            "Enter" &&
                                                                                                        savePostMeta(
                                                                                                            post,
                                                                                                            key
                                                                                                        )
                                                                                                    }
                                                                                                    onChange={(e) =>
                                                                                                        setEditInsightTitle(
                                                                                                            e.target.value
                                                                                                        )
                                                                                                    }
                                                                                                    placeholder={
                                                                                                        post.title
                                                                                                    }
                                                                                                />
                                                                                                <p className="text-[10px] text-text-tertiary mt-1">
                                                                                                    Leave blank to use the
                                                                                                    Ghost title.
                                                                                                </p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                    AUTHOR
                                                                                                </label>
                                                                                                <select
                                                                                                    className={`${styles.input} !py-2`}
                                                                                                    value={
                                                                                                        editInsightAuthor
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        setEditInsightAuthor(
                                                                                                            e
                                                                                                                .target
                                                                                                                .value
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <option value="">
                                                                                                        Optional —
                                                                                                        select team
                                                                                                        member
                                                                                                    </option>
                                                                                                    {TEAM_AUTHORS.map(
                                                                                                        (
                                                                                                            author
                                                                                                        ) => (
                                                                                                            <option
                                                                                                                key={
                                                                                                                    author.id
                                                                                                                }
                                                                                                                value={
                                                                                                                    author.id
                                                                                                                }
                                                                                                            >
                                                                                                                {
                                                                                                                    author.name
                                                                                                                }
                                                                                                            </option>
                                                                                                        )
                                                                                                    )}
                                                                                                </select>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <div className="flex flex-col gap-3">
                                                                                                {(
                                                                                                    [
                                                                                                        [
                                                                                                            "DIRECTOR",
                                                                                                            editDirector,
                                                                                                            setEditDirector,
                                                                                                        ],
                                                                                                        [
                                                                                                            "AGENCY",
                                                                                                            editAgency,
                                                                                                            setEditAgency,
                                                                                                        ],
                                                                                                        [
                                                                                                            "CLIENT",
                                                                                                            editClient,
                                                                                                            setEditClient,
                                                                                                        ],
                                                                                                    ] as const
                                                                                                ).map(
                                                                                                    ([
                                                                                                        label,
                                                                                                        value,
                                                                                                        setter,
                                                                                                    ]) => (
                                                                                                        <div
                                                                                                            key={
                                                                                                                label
                                                                                                            }
                                                                                                        >
                                                                                                            <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                                {
                                                                                                                    label
                                                                                                                }
                                                                                                            </label>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                className={`${styles.input} !py-2`}
                                                                                                                value={
                                                                                                                    value
                                                                                                                }
                                                                                                                onKeyDown={(
                                                                                                                    e
                                                                                                                ) =>
                                                                                                                    e.key ===
                                                                                                                        "Enter" &&
                                                                                                                    savePostMeta(
                                                                                                                        post,
                                                                                                                        key
                                                                                                                    )
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    e
                                                                                                                ) =>
                                                                                                                    setter(
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    )
                                                                                                                }
                                                                                                                placeholder="Optional"
                                                                                                            />
                                                                                                        </div>
                                                                                                    )
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="grid grid-cols-2 gap-3">
                                                                                                <div>
                                                                                                    <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                        CREDITS
                                                                                                        — LEFT
                                                                                                    </label>
                                                                                                    <textarea
                                                                                                        className={`${styles.input} !py-2 min-h-[140px] resize-y`}
                                                                                                        value={
                                                                                                            editCreditsCol3
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) =>
                                                                                                            setEditCreditsCol3(
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value
                                                                                                            )
                                                                                                        }
                                                                                                        placeholder={
                                                                                                            "Director\nMark O'Brien\n\nExecutive Producer\nNathan Reilly"
                                                                                                        }
                                                                                                    />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                        CREDITS
                                                                                                        — RIGHT
                                                                                                    </label>
                                                                                                    <textarea
                                                                                                        className={`${styles.input} !py-2 min-h-[140px] resize-y`}
                                                                                                        value={
                                                                                                            editCreditsCol5
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e
                                                                                                        ) =>
                                                                                                            setEditCreditsCol5(
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value
                                                                                                            )
                                                                                                        }
                                                                                                        placeholder={
                                                                                                            "Hair & Makeup Artist\nAitana Silvana\n\nStyling\nKate Brady"
                                                                                                        }
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <p className="text-[10px] text-text-tertiary">
                                                                                                Role on one line, name on
                                                                                                the next. Blank line between
                                                                                                entries.
                                                                                            </p>
                                                                                            <div>
                                                                                                <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                                    HOVER PREVIEW START (SECONDS)
                                                                                                </label>
                                                                                                <input
                                                                                                    type="number"
                                                                                                    min={0}
                                                                                                    step={0.5}
                                                                                                    className={`${styles.input} !py-2`}
                                                                                                    value={
                                                                                                        editPreviewStart
                                                                                                    }
                                                                                                    onKeyDown={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        e.key ===
                                                                                                            "Enter" &&
                                                                                                        savePostMeta(
                                                                                                            post,
                                                                                                            key
                                                                                                        )
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) =>
                                                                                                        setEditPreviewStart(
                                                                                                            e
                                                                                                                .target
                                                                                                                .value
                                                                                                        )
                                                                                                    }
                                                                                                    placeholder="0"
                                                                                                />
                                                                                                <p className="text-[10px] text-text-tertiary mt-1">
                                                                                                    Where the hover-preview
                                                                                                    video starts playing.
                                                                                                    Leave blank to start from
                                                                                                    the beginning.
                                                                                                </p>
                                                                                            </div>
                                                                                        </>
                                                                                    )}

                                                                                    <div className="flex justify-end gap-2 pt-1">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setEditingPostId(
                                                                                                    null
                                                                                                );
                                                                                                setEditingSectionKey(
                                                                                                    null
                                                                                                );
                                                                                            }}
                                                                                            className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-white transition-colors"
                                                                                        >
                                                                                            Cancel
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                savePostMeta(
                                                                                                    post,
                                                                                                    key
                                                                                                )
                                                                                            }
                                                                                            disabled={
                                                                                                isSavingMeta
                                                                                            }
                                                                                            className="px-4 py-2 bg-green-600 text-white text-xs font-bold hover:bg-green-500 rounded transition-colors disabled:opacity-50"
                                                                                        >
                                                                                            {isSavingMeta
                                                                                                ? "Saving…"
                                                                                                : "Save details"}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </DragDropContext>

            {toast && (
                <div
                    className={`${styles.toast} ${toast.type === "success" ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"}`}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
