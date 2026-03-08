"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────

import { GhostPost, GhostTag } from "@/lib/ghost";

type Section = "selectedWork" | "caseStudies";

// ── Styles ───────────────────────────────────────────────────────

const styles = {
    page: "min-h-screen bg-bg text-text-primary font-sans p-6 md:p-10",
    header: "flex items-center justify-between mb-8",
    title: "text-2xl font-bold tracking-tight text-white",
    subtitle: "text-sm text-text-secondary mt-1",
    loginCard: "max-w-sm mx-auto mt-[20vh] bg-bg-card p-8 border border-border",
    input: "w-full px-4 py-3 bg-bg-elevated border border-border text-white text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors",
    btn: "px-5 py-2.5 bg-accent text-white text-sm font-bold hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    btnOutline: "px-3 py-1.5 border border-border text-text-secondary text-xs hover:bg-bg-elevated active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed",
    btnDanger: "px-3 py-1.5 text-red-500/80 text-xs hover:text-red-400 active:scale-[0.98] transition-all",
    card: "bg-bg-card border border-border",
    badge: "px-2 py-0.5 bg-bg-elevated text-text-secondary text-xs border border-border",
    sectionTitle: "text-lg font-bold mb-4",
    grid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
    postItem: "flex items-center gap-3 p-3 transition-colors cursor-pointer group border-b border-border/50 bg-bg-card",
    postThumb: "w-16 h-12 bg-bg-elevated object-cover shrink-0 rounded",
    toast: "fixed bottom-6 right-6 px-5 py-3 text-sm font-bold shadow-lg z-50 transition-all",
};

// ── Limit Config ─────────────────────────────────────────────────
const LIMITS = {
    selectedWork: 6,
    caseStudies: 3
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

    const [selectedWork, setSelectedWork] = useState<GhostPost[]>([]);
    const [caseStudies, setCaseStudies] = useState<GhostPost[]>([]);

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
            const res = await fetch("/api/curation/home");
            if (!res.ok) return;
            const data = await res.json();

            if (data.selectedWork?.length) {
                setSelectedWork(
                    data.selectedWork.map((p: Record<string, unknown>) => ({
                        ...p,
                        tags: (p.tags as string[])?.map((t: string) => ({ id: t, name: t, slug: t })) || [],
                    }))
                );
            }
            if (data.caseStudies?.length) {
                setCaseStudies(
                    data.caseStudies.map((p: Record<string, unknown>) => ({
                        ...p,
                        tags: (p.tags as string[])?.map((t: string) => ({ id: t, name: t, slug: t })) || [],
                    }))
                );
            }
            setHasLoadedSelections(true);
        } catch (err) {
            console.error("Failed to load selections:", err);
        }
    }, []);

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

    const isSelected = (postId: string): Section | null => {
        if (selectedWork.some((p) => p.id === postId)) return "selectedWork";
        if (caseStudies.some((p) => p.id === postId)) return "caseStudies";
        return null;
    };

    const addToSection = (post: GhostPost, section: Section) => {
        if (isSelected(post.id)) return;

        const currentItems = section === "selectedWork" ? selectedWork : caseStudies;
        if (currentItems.length >= LIMITS[section]) {
            showToast(`Limit reached: Maximum ${LIMITS[section]} items for this section.`, "error");
            return;
        }

        if (section === "selectedWork") setSelectedWork((prev) => [...prev, post]);
        else setCaseStudies((prev) => [...prev, post]);
    };

    const removeFromSection = (postId: string, section: Section) => {
        if (section === "selectedWork") setSelectedWork((prev) => prev.filter((p) => p.id !== postId));
        else setCaseStudies((prev) => prev.filter((p) => p.id !== postId));
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        // 1. Internal Reordering
        if (source.droppableId === destination.droppableId) {
            if (source.index === destination.index) return;

            const setter = destination.droppableId === "selectedWork" ? setSelectedWork : setCaseStudies;
            setter((prev) => {
                const arr = [...prev];
                const [removed] = arr.splice(source.index, 1);
                arr.splice(destination.index, 0, removed);
                return arr;
            });
            return;
        }

        // 2. Add from Ghost Posts Library
        if (source.droppableId === "library") {
            const post = posts[source.index];
            if (!post) return;

            const destId = destination.droppableId as Section;
            if (isSelected(post.id)) {
                showToast("Post already added to a section", "error");
                return;
            }

            const destItems = destId === "selectedWork" ? selectedWork : caseStudies;
            if (destItems.length >= LIMITS[destId]) {
                showToast(`Limit reached: Max ${LIMITS[destId]} items.`, "error");
                return;
            }

            const setter = destId === "selectedWork" ? setSelectedWork : setCaseStudies;
            setter((prev) => {
                const arr = [...prev];
                arr.splice(destination.index, 0, post);
                return arr;
            });
            return;
        }

        // 3. Move between sections
        if ((source.droppableId === "selectedWork" || source.droppableId === "caseStudies") &&
            (destination.droppableId === "selectedWork" || destination.droppableId === "caseStudies")) {

            const sourceSetter = source.droppableId === "selectedWork" ? setSelectedWork : setCaseStudies;
            const destSetter = destination.droppableId === "selectedWork" ? setSelectedWork : setCaseStudies;
            const destId = destination.droppableId as Section;
            const destItems = destId === "selectedWork" ? selectedWork : caseStudies;

            if (destItems.length >= LIMITS[destId]) {
                showToast(`Limit reached: Max ${LIMITS[destId]} items.`, "error");
                return;
            }

            let movedItem: GhostPost | null = null;
            sourceSetter((prev) => {
                const arr = [...prev];
                [movedItem] = arr.splice(source.index, 1);
                return arr;
            });

            if (movedItem) {
                destSetter((prev) => {
                    const arr = [...prev];
                    arr.splice(destination.index, 0, movedItem!);
                    return arr;
                });
            }
        }
    };

    const handleSave = useCallback(async () => {
        if (!authed) return;
        setSaving(true);
        try {
            const res = await fetch("/api/curation/home", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedWork: selectedWork.map((p) => p.id),
                    caseStudies: caseStudies.map((p) => p.id),
                }),
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
    }, [selectedWork, caseStudies, authed]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!hasLoadedSelections) return;
        const timer = setTimeout(() => handleSave(), 1000);
        return () => clearTimeout(timer);
    }, [selectedWork, caseStudies, handleSave, hasLoadedSelections]);

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

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Content Picker</h1>
                    <p className={styles.subtitle}>Select and order Ghost posts for the homepage</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${saving ? "bg-accent animate-pulse" : "bg-green-500"}`} />
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        {saving ? "Saving..." : "All changes saved"}
                    </span>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.grid}>
                    {/* ── Library ────────────────────────────────────────── */}
                    <div>
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
                                                const section = isSelected(post.id);
                                                return (
                                                    <Draggable key={`lib-${post.id}`} draggableId={`lib-${post.id}`} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`${styles.postItem} ${section ? "opacity-30 grayscale" : ""} ${snapshot.isDragging ? "bg-accent/20 border-accent/50 z-50 shadow-2xl" : "hover:bg-bg-elevated"}`}
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
                                                                {section && (
                                                                    <span className="text-[10px] text-accent font-bold uppercase tracking-tight shrink-0 px-2 opacity-100 bg-accent/10 py-1 rounded">
                                                                        {section === "selectedWork" ? "Work" : "Case"}
                                                                    </span>
                                                                )}
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

                    {/* ── Selected Work ──────────────────────────────────── */}
                    <div className="flex flex-col">
                        <h2 className={styles.sectionTitle}>
                            Selected Work <span className="text-white/30 text-sm ml-1">({selectedWork.length}/{LIMITS.selectedWork})</span>
                        </h2>
                        <Droppable droppableId="selectedWork">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`${styles.card} h-[520px] overflow-y-auto ${snapshot.isDraggingOver ? "bg-accent/5 border-dashed border-accent/40" : ""}`}
                                    data-lenis-prevent
                                >
                                    {selectedWork.map((post, i) => (
                                        <Draggable key={`work-${post.id}`} draggableId={`work-${post.id}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${styles.postItem} ${snapshot.isDragging ? "bg-accent/20 z-50 shadow-2xl border-accent" : "hover:bg-bg-elevated"}`}
                                                >
                                                    <span className="text-xs text-white/30 w-4 shrink-0">{i + 1}</span>
                                                    {post.feature_image ? (
                                                        <img src={post.feature_image} alt="" className={styles.postThumb} />
                                                    ) : (
                                                        <div className={styles.postThumb} />
                                                    )}
                                                    <p className="text-sm font-medium flex-1 truncate">{post.title}</p>
                                                    <button
                                                        onClick={() => removeFromSection(post.id, "selectedWork")}
                                                        className={styles.btnDanger}
                                                    >✕</button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {/* Empty Slots */}
                                    {selectedWork.length < LIMITS.selectedWork && (
                                        Array(LIMITS.selectedWork - selectedWork.length).fill(null).map((_, i) => (
                                            <div key={`empty-work-${i}`} className="flex items-center gap-3 p-3 border-b border-white/5 opacity-10 border-dashed min-h-[75px]">
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

                    {/* ── Case Studies ───────────────────────────────────── */}
                    <div className="flex flex-col">
                        <h2 className={styles.sectionTitle}>
                            Case Studies <span className="text-white/30 text-sm ml-1">({caseStudies.length}/{LIMITS.caseStudies})</span>
                        </h2>
                        <Droppable droppableId="caseStudies">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`${styles.card} h-[280px] overflow-y-auto ${snapshot.isDraggingOver ? "bg-accent/5 border-dashed border-accent/40" : ""}`}
                                    data-lenis-prevent
                                >
                                    {caseStudies.map((post, i) => (
                                        <Draggable key={`case-${post.id}`} draggableId={`case-${post.id}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${styles.postItem} ${snapshot.isDragging ? "bg-accent/20 z-50 shadow-2xl border-accent" : "hover:bg-bg-elevated"}`}
                                                >
                                                    <span className="text-xs text-white/30 w-4 shrink-0">{i + 1}</span>
                                                    {post.feature_image ? (
                                                        <img src={post.feature_image} alt="" className={styles.postThumb} />
                                                    ) : (
                                                        <div className={styles.postThumb} />
                                                    )}
                                                    <p className="text-sm font-medium flex-1 truncate">{post.title}</p>
                                                    <button
                                                        onClick={() => removeFromSection(post.id, "caseStudies")}
                                                        className={styles.btnDanger}
                                                    >✕</button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}

                                    {/* Empty Slots */}
                                    {caseStudies.length < LIMITS.caseStudies && (
                                        Array(LIMITS.caseStudies - caseStudies.length).fill(null).map((_, i) => (
                                            <div key={`empty-case-${i}`} className="flex items-center gap-3 p-3 border-b border-white/5 opacity-10 border-dashed min-h-[75px]">
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
                </div>
            </DragDropContext>

            {toast && (
                <div className={`${styles.toast} ${toast.type === "success" ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

