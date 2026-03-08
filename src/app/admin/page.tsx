"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────

import { GhostPost, GhostTag } from "@/lib/ghost";

// ── Types ────────────────────────────────────────────────────────

type Section = "selectedWork" | "caseStudies";

// ── Styles ───────────────────────────────────────────────────────

const styles = {
    page: "min-h-screen bg-[#0e0f11] text-white font-sans p-6 md:p-10",
    header: "flex items-center justify-between mb-8",
    title: "text-2xl font-bold tracking-tight",
    subtitle: "text-sm text-white/50 mt-1",
    loginCard: "max-w-sm mx-auto mt-[20vh] bg-[#1a1b1e] p-8 border border-[#2a2b2e]",
    input: "w-full px-4 py-3 bg-[#141517] border border-[#2a2b2e] text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D86001] transition-colors",
    btn: "px-5 py-2.5 bg-[#D86001] text-white text-sm font-bold hover:bg-[#FF7A29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    btnOutline: "px-3 py-1.5 border border-[#2a2b2e] text-white/60 text-xs hover:bg-white/5 transition-colors",
    btnDanger: "px-3 py-1.5 text-red-400/70 text-xs hover:text-red-400 transition-colors",
    card: "bg-[#1a1b1e] border border-[#2a2b2e] overflow-hidden",
    badge: "px-2 py-0.5 bg-[#222326] text-white/50 text-[10px] border border-[#2a2b2e]",
    sectionTitle: "text-lg font-bold mb-4",
    grid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
    postItem: "flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer group",
    postThumb: "w-16 h-12 bg-[#222326] object-cover shrink-0",
    toast: "fixed bottom-6 right-6 px-5 py-3 text-sm font-bold shadow-lg z-50 transition-all",
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

    // Track if we've loaded initial data to prevent immediate autosave
    const isInitialMount = useRef(true);
    const [hasLoadedSelections, setHasLoadedSelections] = useState(false);

    // ── Toast helper ─────────────────────────────────────────────

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Auth ─────────────────────────────────────────────────────

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

    // ── Fetch posts ──────────────────────────────────────────────

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
            setGhostError("Could not load posts from Ghost. The CMS may be temporarily unavailable.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Load current selections ──────────────────────────────────

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

    // ── Search debounce ──────────────────────────────────────────

    useEffect(() => {
        if (!authed) return;
        const timer = setTimeout(() => fetchPosts(search), 300);
        return () => clearTimeout(timer);
    }, [search, authed, fetchPosts]);

    // ── Selection helpers ────────────────────────────────────────

    const isSelected = (postId: string): Section | null => {
        if (selectedWork.some((p) => p.id === postId)) return "selectedWork";
        if (caseStudies.some((p) => p.id === postId)) return "caseStudies";
        return null;
    };

    const addToSection = (post: GhostPost, section: Section) => {
        if (isSelected(post.id)) return;
        if (section === "selectedWork") setSelectedWork((prev) => [...prev, post]);
        else setCaseStudies((prev) => [...prev, post]);
    };

    const removeFromSection = (postId: string, section: Section) => {
        if (section === "selectedWork") setSelectedWork((prev) => prev.filter((p) => p.id !== postId));
        else setCaseStudies((prev) => prev.filter((p) => p.id !== postId));
    };

    const moveInSection = (index: number, direction: -1 | 1, section: Section) => {
        const setter = section === "selectedWork" ? setSelectedWork : setCaseStudies;
        setter((prev) => {
            const arr = [...prev];
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= arr.length) return arr;
            [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
            return arr;
        });
    };

    // ── Save ─────────────────────────────────────────────────────

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

            if (!res.ok) {
                showToast("Failed to autosave", "error");
            }
        } catch {
            showToast("Connection error during autosave", "error");
        } finally {
            setSaving(false);
        }
    }, [selectedWork, caseStudies, authed, showToast, setAuthed]);

    // ── Autosave Effect ──────────────────────────────────────────

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only autosave if we've successfully loaded the initial state
        if (!hasLoadedSelections) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 1000); // 1s debounce

        return () => clearTimeout(timer);
    }, [selectedWork, caseStudies, handleSave, hasLoadedSelections]);

    // ── Tag helpers ──────────────────────────────────────────────

    const getTagName = (tag: GhostTag | string): string => {
        return typeof tag === "string" ? tag : tag.name;
    };

    // ── Login gate ───────────────────────────────────────────────

    if (!authed) {
        return (
            <div className={styles.page}>
                <div className={styles.loginCard}>
                    <h1 className="text-xl font-semibold mb-1">Content Picker</h1>
                    <p className="text-sm text-white/50 mb-6">Enter your admin password to continue.</p>
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

    // ── Main UI ──────────────────────────────────────────────────

    return (
        <div className={styles.page}>
            {/* Header */}
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

            <div className={styles.grid}>
                {/* ── Ghost Posts (Browse) ───────────────────────────────── */}
                <div>
                    <h2 className={styles.sectionTitle}>Ghost Posts</h2>
                    <input
                        type="text"
                        placeholder="Search by title, slug, or tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${styles.input} mb-4`}
                    />

                    {ghostError && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 mb-4 text-sm text-red-300">
                            {ghostError}
                        </div>
                    )}

                    <div className={`${styles.card} max-h-[70vh] overflow-y-auto`}>
                        {loading ? (
                            <div className="p-8 text-center text-white/30">Loading posts...</div>
                        ) : posts.length === 0 ? (
                            <div className="p-8 text-center text-white/30">No posts found</div>
                        ) : (
                            posts.map((post) => {
                                const section = isSelected(post.id);
                                return (
                                    <div key={post.id} className={`${styles.postItem} ${section ? "opacity-40" : ""}`}>
                                        {post.feature_image ? (
                                            <img src={post.feature_image} alt="" className={styles.postThumb} />
                                        ) : (
                                            <div className={styles.postThumb} />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{post.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {post.tags?.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className={styles.badge}>
                                                        {getTagName(tag)}
                                                    </span>
                                                ))}
                                                <span className="text-[10px] text-white/30">
                                                    {new Date(post.published_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {section ? (
                                            <span className="text-[10px] text-[#D86001] shrink-0">
                                                In {section === "selectedWork" ? "Work" : "Studies"}
                                            </span>
                                        ) : (
                                            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => addToSection(post, "selectedWork")}
                                                    className={styles.btnOutline}
                                                    title="Add to Selected Work"
                                                >
                                                    + Work
                                                </button>
                                                <button
                                                    onClick={() => addToSection(post, "caseStudies")}
                                                    className={styles.btnOutline}
                                                    title="Add to Case Studies"
                                                >
                                                    + Studies
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Selected Work Bucket ─────────────────────────────── */}
                <div>
                    <h2 className={styles.sectionTitle}>
                        Selected Work <span className="text-white/30 text-sm ml-1">({selectedWork.length})</span>
                    </h2>
                    <div className={`${styles.card} min-h-[200px]`}>
                        {selectedWork.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-sm">
                                No posts selected. Add from the Ghost posts list.
                            </div>
                        ) : (
                            selectedWork.map((post, i) => (
                                <div key={post.id} className={styles.postItem}>
                                    <span className="text-xs text-white/30 w-5 shrink-0 text-center">{i + 1}</span>
                                    {post.feature_image ? (
                                        <img src={post.feature_image} alt="" className={styles.postThumb} />
                                    ) : (
                                        <div className={styles.postThumb} />
                                    )}
                                    <p className="text-sm font-medium flex-1 truncate">{post.title}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => moveInSection(i, -1, "selectedWork")}
                                            disabled={i === 0}
                                            className={`${styles.btnOutline} ${i === 0 ? "opacity-20" : ""}`}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveInSection(i, 1, "selectedWork")}
                                            disabled={i === selectedWork.length - 1}
                                            className={`${styles.btnOutline} ${i === selectedWork.length - 1 ? "opacity-20" : ""}`}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => removeFromSection(post.id, "selectedWork")}
                                            className={styles.btnDanger}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Case Studies Bucket ──────────────────────────────── */}
                <div>
                    <h2 className={styles.sectionTitle}>
                        Case Studies <span className="text-white/30 text-sm ml-1">({caseStudies.length})</span>
                    </h2>
                    <div className={`${styles.card} min-h-[200px]`}>
                        {caseStudies.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-sm">
                                No posts selected. Add from the Ghost posts list.
                            </div>
                        ) : (
                            caseStudies.map((post, i) => (
                                <div key={post.id} className={styles.postItem}>
                                    <span className="text-xs text-white/30 w-5 shrink-0 text-center">{i + 1}</span>
                                    {post.feature_image ? (
                                        <img src={post.feature_image} alt="" className={styles.postThumb} />
                                    ) : (
                                        <div className={styles.postThumb} />
                                    )}
                                    <p className="text-sm font-medium flex-1 truncate">{post.title}</p>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => moveInSection(i, -1, "caseStudies")}
                                            disabled={i === 0}
                                            className={`${styles.btnOutline} ${i === 0 ? "opacity-20" : ""}`}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveInSection(i, 1, "caseStudies")}
                                            disabled={i === caseStudies.length - 1}
                                            className={`${styles.btnOutline} ${i === caseStudies.length - 1 ? "opacity-20" : ""}`}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => removeFromSection(post.id, "caseStudies")}
                                            className={styles.btnDanger}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── Toast notification ──────────────────────────────────── */}
            {toast && (
                <div
                    className={`${styles.toast} ${toast.type === "success"
                        ? "bg-green-600/90 text-white"
                        : "bg-red-600/90 text-white"
                        }`}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
