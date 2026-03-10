"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { GhostPost, GhostTag } from "@/lib/ghost";

export type CuratedPost = GhostPost & {
    director?: string;
    client?: string;
};

// ── Types & Constants ─────────────────────────────────────────────

export const SECTIONS = [
    "home.selectedWork",
    "home.caseStudies",
    "work.commercial",
    "work.brand-stories",
    "work.music",
    "work.live",
    "case-studies",
    "home.clients"
] as const;

export type SectionKey = typeof SECTIONS[number];

const LIMITS: Record<SectionKey, number> = {
    "home.selectedWork": 6,
    "home.caseStudies": 3,
    "work.commercial": 6,
    "work.brand-stories": 6,
    "work.music": 6,
    "work.live": 6,
    "case-studies": 20,
    "home.clients": 16
};

type Tab = "home" | "work" | "case-studies" | "clients";

const TABS: Record<Tab, { key: SectionKey; title: string }[]> = {
    "home": [
        { key: "home.selectedWork", title: "Home: Selected Work" },
        { key: "home.caseStudies", title: "Home: Case Studies" }
    ],
    "work": [
        { key: "work.commercial", title: "Work: Commercial" },
        { key: "work.brand-stories", title: "Work: Brand Stories" },
        { key: "work.music", title: "Work: Music" },
        { key: "work.live", title: "Work: Live" }
    ],
    "case-studies": [
        { key: "case-studies", title: "Case Studies Page" }
    ],
    "clients": [
        { key: "home.clients", title: "Clients Carousel (16 items)" }
    ]
};

// ── Styles ───────────────────────────────────────────────────────

const styles = {
    page: "min-h-screen bg-bg text-text-primary font-sans p-6 md:p-10",
    header: "flex items-center justify-between mb-8",
    title: "text-2xl font-bold tracking-tight text-white",
    subtitle: "text-sm text-text-secondary mt-1",
    loginCard: "max-w-sm mx-auto mt-[20vh] bg-bg-card p-8 border border-border",
    input: "w-full px-4 py-3 bg-bg-elevated border border-border text-white text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors",
    btn: "px-5 py-2.5 bg-accent text-white text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    btnDanger: "px-3 py-1.5 text-red-500/80 text-xs hover:text-red-400 active:scale-[0.98] transition-all",
    card: "bg-bg-card border border-border",
    badge: "px-2 py-0.5 bg-bg-elevated text-text-secondary text-xs border border-border capitalize",
    sectionTitle: "text-lg font-bold mb-4",
    grid: "grid grid-cols-1 lg:grid-cols-4 gap-6",
    postItem: "flex items-center gap-3 p-3 transition-colors cursor-pointer group border-b border-border/50 bg-bg-card",
    postThumb: "w-16 h-12 bg-bg-elevated object-cover shrink-0 rounded",
    toast: "fixed bottom-6 right-6 px-5 py-3 text-sm font-bold shadow-lg z-50 transition-all",
    tabBtn: "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
};

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

    const [activeTab, setActiveTab] = useState<Tab>("home");

    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editDirector, setEditDirector] = useState("");
    const [editClient, setEditClient] = useState("");
    const [isSavingMeta, setIsSavingMeta] = useState(false);

    // Unified state for all sections
    const [selections, setSelections] = useState<Record<SectionKey, CuratedPost[]>>({
        "home.selectedWork": [],
        "home.caseStudies": [],
        "work.commercial": [],
        "work.brand-stories": [],
        "work.music": [],
        "work.live": [],
        "case-studies": [],
        "home.clients": []
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

    const fetchPosts = useCallback(async (query = "") => {
        setLoading(true);
        setGhostError("");
        try {
            const params = new URLSearchParams();
            if (query) params.set("search", query);
            params.set("limit", "100");
            const res = await fetch(`/api/ghost/posts?${params.toString()}`);
            if (res.status === 401) {
                setAuthed(false);
                return;
            }
            if (!res.ok) throw new Error("Fetch failed");
            const data = await res.json();
            setPosts(data.posts || []);
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

            const newSelections = { ...selections };
            for (const key of SECTIONS) {
                if (data[key]?.length) {
                    newSelections[key] = data[key].map((p: any) => ({
                        ...p,
                        tags: (p.tags as string[])?.map((t: string) => ({ id: t, name: t, slug: t })) || [],
                    }));
                }
            }

            setSelections(newSelections);
            setHasLoadedSelections(true);
        } catch (err) {
            console.error("Failed to load selections:", err);
        }
    }, []);

    const openEditPost = (post: CuratedPost) => {
        setEditingPostId(post.id);
        setEditDirector(post.director || "");
        setEditClient(post.client || "");
    };

    const savePostMeta = async (post: CuratedPost, sectionKey: SectionKey) => {
        setIsSavingMeta(true);
        try {
            const res = await fetch("/api/metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: post.id,
                    data: {
                        director: editDirector,
                        client: editClient
                    }
                })
            });

            if (res.ok) {
                // Update local state
                setSelections(prev => {
                    const newSec = [...prev[sectionKey]];
                    const i = newSec.findIndex(p => p.id === post.id);
                    if (i > -1) {
                        newSec[i] = { ...newSec[i], director: editDirector, client: editClient };
                    }
                    return { ...prev, [sectionKey]: newSec };
                });
                setEditingPostId(null);
                showToast("Saved metadata", "success");
            } else {
                showToast("Failed to save metadata", "error");
            }
        } catch (err) {
            showToast("Connection error saving metadata", "error");
        } finally {
            setIsSavingMeta(false);
        }
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

    const isSelected = (postId: string): SectionKey | null => {
        for (const section of SECTIONS) {
            if (selections[section].some((p) => p.id === postId)) {
                return section;
            }
        }
        return null;
    };

    const removeFromSection = (postId: string, section: SectionKey) => {
        setSelections((prev) => ({
            ...prev,
            [section]: prev[section].filter((p) => p.id !== postId)
        }));
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        // 1. Internal Reordering
        if (source.droppableId === destination.droppableId) {
            if (source.index === destination.index) return;

            const sectionKey = destination.droppableId as SectionKey;
            setSelections((prev) => {
                const arr = [...prev[sectionKey]];
                const [removed] = arr.splice(source.index, 1);
                arr.splice(destination.index, 0, removed);
                return { ...prev, [sectionKey]: arr };
            });
            return;
        }

        // 2. Add from Ghost Posts Library
        if (source.droppableId === "library") {
            const post = posts[source.index];
            if (!post) return;

            const destId = destination.droppableId as SectionKey;

            // Prevent duplicates within the same section
            if (selections[destId].some(p => p.id === post.id)) {
                showToast("Post already added to this section", "error");
                return;
            }

            if (selections[destId].length >= LIMITS[destId]) {
                showToast(`Limit reached: Max ${LIMITS[destId]} items.`, "error");
                return;
            }

            setSelections((prev) => {
                const arr = [...prev[destId]];
                arr.splice(destination.index, 0, post);
                return { ...prev, [destId]: arr };
            });
            return;
        }

        // 3. Move between sections
        if (SECTIONS.includes(source.droppableId as SectionKey) && SECTIONS.includes(destination.droppableId as SectionKey)) {
            const sourceId = source.droppableId as SectionKey;
            const destId = destination.droppableId as SectionKey;

            if (selections[destId].length >= LIMITS[destId]) {
                showToast(`Limit reached: Max ${LIMITS[destId]} items.`, "error");
                return;
            }

            let movedItem: GhostPost | null = null;

            setSelections((prev) => {
                const sourceArr = [...prev[sourceId]];
                [movedItem] = sourceArr.splice(source.index, 1);

                if (!movedItem) return prev;

                const destArr = [...prev[destId]];
                // Prevent duplicate
                if (destArr.some(p => p.id === movedItem!.id)) {
                    showToast("Post already added to this section", "error");
                    return prev; // abort
                }

                destArr.splice(destination.index, 0, movedItem);

                return {
                    ...prev,
                    [sourceId]: sourceArr,
                    [destId]: destArr
                };
            });
        }
    };

    const handleSave = useCallback(async () => {
        if (!authed) return;
        setSaving(true);
        try {
            // Build payload for all sections
            const payload: Record<string, string[]> = {};
            for (const key of SECTIONS) {
                payload[key] = selections[key].map(p => p.id);
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

            if (!res.ok) showToast("Failed to autosave", "error");
        } catch {
            showToast("Connection error during autosave", "error");
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

    const getTagName = (tag: GhostTag | string): string => {
        return typeof tag === "string" ? tag : tag.name;
    };

    if (!authed) {
        return (
            <div className={styles.page}>
                <div className={styles.loginCard}>
                    <h1 className="text-xl font-semibold mb-1">Content Picker</h1>
                    <p className="text-sm text-white/50 mb-6">Enter admin password to continue.</p>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className={`${styles.input} mb-4`}
                        autoFocus
                    />
                    {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
                    <button onClick={handleLogin} disabled={loginLoading || !password} className={`${styles.btn} w-full`}>
                        {loginLoading ? "Logging in..." : "Log In"}
                    </button>
                </div>
            </div>
        );
    }

    const activeSections = TABS[activeTab];

    const missingInfoCount = activeSections.reduce((acc, sec) => {
        if (sec.key.includes("case-study") || sec.key.includes("case-studies")) return acc;
        return acc + selections[sec.key].filter(p => {
            if (sec.key === "home.clients") return !p.director; // For clients, we only use 'director' as 'Display Title'
            return !p.director || !p.client;
        }).length;
    }, 0);

    const tabHasMissingMeta = (tabKey: Tab) => {
        const tabSections = TABS[tabKey];
        return tabSections.some(sec => {
            if (sec.key.includes("case-study") || sec.key.includes("case-studies")) return false;
            return selections[sec.key].some(p => {
                if (sec.key === "home.clients") return !p.director;
                return !p.director || !p.client;
            });
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Content Picker</h1>
                    <p className={styles.subtitle}>Select and order Ghost posts across the website</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${saving ? "bg-accent animate-pulse" : "bg-green-500"}`} />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        {saving ? "Saving..." : "All changes saved"}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-8 border-b border-white/10">
                {(["home", "work", "case-studies", "clients"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${styles.tabBtn} flex items-center gap-2 ${activeTab === tab ? "border-accent text-accent" : "border-transparent text-white/50 hover:text-white/80"}`}
                    >
                        {tab === "home" ? "Home Page" : tab === "work" ? "Work Categories" : tab === "clients" ? "Clients Carousel" : "Case Studies"}
                        {tabHasMissingMeta(tab) && (
                            <span title="Missing metadata" className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0">!</span>
                        )}
                    </button>
                ))}
            </div>

            {missingInfoCount > 0 && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-start gap-4 text-red-200 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    <div>
                        <strong className="font-semibold text-red-400 block mb-0.5">Missing Metadata</strong>
                        You have {missingInfoCount} work {missingInfoCount === 1 ? 'post' : 'posts'} in this tab missing {activeTab === "clients" ? 'Client Name' : 'Director or Client info'}. They are highlighted below in red.
                    </div>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.grid}>
                    {/* ── Library (Takes 1 column on large screens) ─────────── */}
                    <div className="lg:col-span-1">
                        <h2 className={styles.sectionTitle}>Ghost Library</h2>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`${styles.input} mb-4`}
                        />

                        {ghostError && (
                            <div className="bg-red-500/10 border border-red-500/30 p-4 mb-4 text-sm text-red-300 rounded">
                                {ghostError}
                            </div>
                        )}

                        <div className={`${styles.card} h-[600px] overflow-y-scroll relative overflow-x-hidden`} data-lenis-prevent>
                            <Droppable droppableId="library" isDropDisabled={true}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-full"
                                    >
                                        {loading ? (
                                            <div className="p-8 text-center text-white/30">Loading...</div>
                                        ) : posts.length === 0 ? (
                                            <div className="p-8 text-center text-white/30">No posts found</div>
                                        ) : (
                                            posts.map((post, index) => {
                                                // Check if post is in currently visible active sections
                                                // Disable grey-out logic for the clients tab as requested
                                                const inActiveSection = activeTab !== "clients" && activeSections.some(sec => selections[sec.key].some(p => p.id === post.id));

                                                return (
                                                    <Draggable key={`lib-${post.id}`} draggableId={`lib-${post.id}`} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`${styles.postItem} ${inActiveSection ? "opacity-30 grayscale" : ""} ${snapshot.isDragging ? "bg-accent/20 border-accent/50 z-50 shadow-2xl" : "hover:bg-bg-elevated"}`}
                                                            >
                                                                {post.feature_image ? (
                                                                    <img src={post.feature_image} alt="" className={styles.postThumb} />
                                                                ) : (
                                                                    <div className={styles.postThumb} />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">{post.title}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        {post.tags?.slice(0, 1).map((tag, i) => (
                                                                            <span key={i} className={styles.badge}>{getTagName(tag)}</span>
                                                                        ))}
                                                                        <span className="text-[10px] text-white/20">
                                                                            {new Date(post.published_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
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

                    {/* ── Active Drop Areas ──────────────────────────────────── */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                        {activeSections.map(({ key, title }) => (
                            <div key={key} className="flex flex-col">
                                <h2 className={styles.sectionTitle}>
                                    {title} <span className="text-white/30 text-sm ml-1">({selections[key].length}/{LIMITS[key]})</span>
                                </h2>
                                <Droppable droppableId={key}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`${styles.card} min-h-[120px] h-auto ${snapshot.isDraggingOver ? "bg-accent/5 border-dashed border-accent/40" : ""}`}
                                            data-lenis-prevent
                                        >
                                            {selections[key].map((post, i) => {
                                                const isCaseStudy = key.includes("case-study") || key.includes("case-studies");
                                                const hasMissingMeta = !isCaseStudy && (
                                                    key === "home.clients" ? !post.director : (!post.director || !post.client)
                                                );

                                                return (
                                                    <Draggable key={`${key}-${post.id}`} draggableId={`${key}-${post.id}`} index={i}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`flex flex-col border-b border-border/50 ${hasMissingMeta ? "border-l-4 border-l-red-500" : ""}`}
                                                            >
                                                                <div
                                                                    onClick={() => !isCaseStudy && openEditPost(post)}
                                                                    className={`flex items-center gap-3 p-3 transition-colors group bg-bg-card ${snapshot.isDragging ? "bg-accent/20 z-50 shadow-2xl border border-accent" : hasMissingMeta ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-bg-elevated"} ${!isCaseStudy ? "cursor-pointer" : ""}`}
                                                                >
                                                                    <span className="text-xs text-white/30 w-4 shrink-0 cursor-grab">{i + 1}</span>
                                                                    {post.feature_image ? (
                                                                        <img src={post.feature_image} alt="" className={styles.postThumb} />
                                                                    ) : (
                                                                        <div className={styles.postThumb} />
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">{post.title}</p>
                                                                        {(post.director || post.client) && (
                                                                            <p className="text-xs text-text-tertiary truncate">
                                                                                {key === "home.clients" ? (post.director && `Client: ${post.director}`) : (
                                                                                    <>
                                                                                        {post.director && `Dir: ${post.director}`}
                                                                                        {post.client && post.director && " | "}
                                                                                        {post.client && `Client: ${post.client}`}
                                                                                    </>
                                                                                )}
                                                                            </p>
                                                                        )}
                                                                        {hasMissingMeta && (
                                                                            <p className="text-xs text-red-400 mt-1 font-medium bg-red-500/10 inline-block px-1.5 py-0.5 rounded">Missing Metadata</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        {!isCaseStudy && (
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); openEditPost(post); }}
                                                                                className="px-3 py-1 text-green-500/80 text-xs hover:text-green-400 active:scale-[0.98] transition-all bg-bg-elevated rounded"
                                                                            >Edit</button>
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); removeFromSection(post.id, key); }}
                                                                            className={`${styles.btnDanger} bg-bg-elevated rounded`}
                                                                        >✕</button>
                                                                    </div>
                                                                </div>

                                                                {editingPostId === post.id && !isCaseStudy && (
                                                                    <div className="p-4 bg-bg-elevated flex flex-col gap-4 shadow-inner">
                                                                        <div className="flex gap-4">
                                                                            <div className="flex-1">
                                                                                <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">
                                                                                    {key === "home.clients" ? "DISPLAY TITLE" : "DIRECTOR"}
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className={`${styles.input} !py-2`}
                                                                                    value={editDirector}
                                                                                    onKeyDown={(e) => e.key === 'Enter' && savePostMeta(post, key)}
                                                                                    onChange={e => setEditDirector(e.target.value)}
                                                                                    placeholder={key === "home.clients" ? "e.g. Client Name" : "e.g. John Doe"}
                                                                                />
                                                                            </div>
                                                                            {key !== "home.clients" && (
                                                                                <div className="flex-1">
                                                                                    <label className="block text-xs text-text-tertiary mb-1 font-bold tracking-wider">CLIENT</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`${styles.input} !py-2`}
                                                                                        value={editClient}
                                                                                        onKeyDown={(e) => e.key === 'Enter' && savePostMeta(post, key)}
                                                                                        onChange={e => setEditClient(e.target.value)}
                                                                                        placeholder="e.g. Nike"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex justify-end gap-2">
                                                                            <button
                                                                                onClick={() => setEditingPostId(null)}
                                                                                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-white transition-colors"
                                                                            >Cancel</button>
                                                                            <button
                                                                                onClick={() => savePostMeta(post, key)}
                                                                                disabled={isSavingMeta}
                                                                                className="px-4 py-2 bg-green-600 text-white text-xs font-bold hover:bg-green-500 rounded transition-colors disabled:opacity-50"
                                                                            >{isSavingMeta ? "Saving..." : "Save"}</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}

                                            {/* Empty Slots */}
                                            {selections[key].length < LIMITS[key] && (
                                                Array(LIMITS[key] - selections[key].length).fill(null).map((_, i) => (
                                                    <div key={`empty-${key}-${i}`} className="flex items-center gap-3 p-3 border-b border-white/5 opacity-10 border-dashed min-h-[75px]">
                                                        <div className="w-16 h-12 bg-white/5 rounded shrink-0 border border-dashed border-white/20" />
                                                        <div className="flex-1 h-3 bg-white/10 rounded w-1/2" />
                                                    </div>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>

            {toast && (
                <div className={`${styles.toast} ${toast.type === "success" ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"}`}>
                    {toast.msg}
                </div>
            )
            }
        </div >
    );
}
