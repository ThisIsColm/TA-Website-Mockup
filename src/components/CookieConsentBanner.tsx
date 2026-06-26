"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    type ConsentValue,
    getStoredConsent,
    onOpenCookieSettings,
    setStoredConsent,
} from "@/lib/cookieConsent";

/**
 * Minimal, non-blocking cookie consent banner anchored to the bottom of the
 * viewport. Appears on first visit (no stored choice), and again whenever the
 * "Cookie settings" footer link dispatches the open event.
 *
 * Site continues to render and remain interactive while the banner is shown.
 */
export default function CookieConsentBanner() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<ConsentValue | null>(null);

    useEffect(() => {
        const stored = getStoredConsent();
        setCurrent(stored);
        if (stored === null) setVisible(true);

        return onOpenCookieSettings(() => {
            setCurrent(getStoredConsent());
            setVisible(true);
        });
    }, []);

    if (pathname?.startsWith("/admin")) return null;
    if (!visible) return null;

    const choose = (value: ConsentValue) => {
        setStoredConsent(value);
        setCurrent(value);
        setVisible(false);
    };

    return (
        <div
            role="region"
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-3 z-[100] md:inset-x-auto md:right-4 md:bottom-4 md:max-w-[420px]"
        >
            <div className="rounded-lg border border-black/10 bg-white/95 px-4 py-3 text-black shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/85">
                <p className="text-[13px] leading-snug">
                    We use necessary cookies to make this site work. With your
                    permission, we&rsquo;d also like to use optional cookies to help us
                    understand how people use the site.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => choose("accepted")}
                        className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Accept cookies
                    </button>
                    <button
                        type="button"
                        onClick={() => choose("necessary")}
                        className="rounded-md border border-black/15 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-black transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Necessary cookies only
                    </button>
                    {current ? (
                        <span className="ml-auto text-[11px] text-black/50">
                            Current: {current === "accepted" ? "All cookies" : "Necessary only"}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
