/**
 * Admin authentication helpers.
 * Shared between API routes that need auth checks.
 */

import { NextRequest } from "next/server";

const TOKEN_COOKIE = "admin_token";

/**
 * Check if request has a valid admin cookie.
 */
export function isAuthenticated(request: NextRequest): boolean {
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) return false;

    try {
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        return decoded.startsWith("tinyark:");
    } catch {
        return false;
    }
}
