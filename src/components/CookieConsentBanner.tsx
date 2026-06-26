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
 * Small, unintrusive cookie consent card pinned to the bottom-right corner.
 * Appears on first visit and whenever the footer "Cookie settings" link
 * dispatches the open event.
 */
export default function CookieConsentBanner() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<ConsentValue | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = getStoredConsent();
        setCurrent(stored);
        if (stored === null) {
            setVisible(true);
            requestAnimationFrame(() => setMounted(true));
        }

        return onOpenCookieSettings(() => {
            setCurrent(getStoredConsent());
            setVisible(true);
            requestAnimationFrame(() => setMounted(true));
        });
    }, []);

    if (pathname?.startsWith("/admin")) return null;
    if (!visible) return null;

    const choose = (value: ConsentValue) => {
        setMounted(false);
        setCurrent(value);
        window.setTimeout(() => {
            setStoredConsent(value);
            setVisible(false);
        }, 180);
    };

    return (
        <div
            role="region"
            aria-label="Cookie consent"
            className={`fixed bottom-5 right-5 z-[100] w-[min(calc(100vw-32px),340px)] transition-all duration-200 ease-out ${
                mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
            }`}
        >
            <div className="bg-[#EAE4DD] border border-black/10 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.22)] px-5 py-4">
                <p className="font-sans font-normal text-[13px] leading-[1.55] tracking-[-0.01em] text-[#353535]">
                    We use cookies to understand how the site is used. You can
                    change this anytime in the footer.
                </p>

                <div className="mt-3.5 flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => choose("accepted")}
                        className="flex-1 bg-accent px-3 py-2 text-center font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] leading-none text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={() => choose("necessary")}
                        className="flex-1 border border-black/15 bg-transparent px-3 py-2 text-center font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] leading-none text-[#353535] transition-colors hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Decline
                    </button>
                </div>

                {current ? (
                    <p className="mt-2.5 font-sans text-[11px] leading-[1.4] tracking-[-0.01em] text-black/45">
                        Current: {current === "accepted" ? "Accepted" : "Declined"}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
