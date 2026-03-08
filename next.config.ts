import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "freight.cargo.site",
            },
            {
                protocol: "https",
                hostname: "www.colmmoore.com",
            },
            {
                protocol: "https",
                hostname: "ghost.tinyark.com",
            },
        ],
    },
};

export default nextConfig;
