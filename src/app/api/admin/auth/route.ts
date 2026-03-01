/**
 * Admin auth — simple password-based login.
 * POST: validates password, sets a session cookie.
 */

import { NextResponse } from "next/server";
import { config } from "@/lib/config";

const TOKEN_COOKIE = "admin_token";

function generateToken(): string {
    const raw = `tinyark:${config.admin.password}:${Date.now()}`;
    return Buffer.from(raw).toString("base64");
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password || password !== config.admin.password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = generateToken();

        const response = NextResponse.json({ success: true });
        response.cookies.set(TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
