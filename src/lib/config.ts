// Centralized config — reads from process.env at runtime

export const config = {
    ghost: {
        url: process.env.GHOST_URL || "",
        contentApiKey: process.env.GHOST_CONTENT_API_KEY || "",
    },
    admin: {
        password: process.env.ADMIN_PASSWORD || "changeme",
    },
    cache: {
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || "600", 10),
    },
};
