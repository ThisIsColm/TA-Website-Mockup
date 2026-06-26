"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { typeClass } from "@/lib/typographyStyles";
import {
    type ConsentValue,
    getStoredConsent,
    onOpenCookieSettings,
    setStoredConsent,
} from "@/lib/cookieConsent";

/**
 * Minimal, non-blocking cookie consent bar anchored to the bottom of the
 * viewport. Appears on first visit (no stored choice), and again whenever the
 * "Cookie settings" footer link dispatches the open event.
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
            className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/10 bg-[#EAE4DD] px-[5.625vw] py-4 md:py-5"
        >
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
                <div className="min-w-0 flex-1">
                    <p
                        className={`max-w-[52ch] text-[#353535] ${typeClass("shared.footerCopyright")}`}
                    >
                        We use necessary cookies to make this site work. With your
                        permission, we&rsquo;d also like to use optional cookies to help
                        us understand how people use the site.
                    </p>
                    {current ? (
                        <p className="mt-2 text-[11px] tracking-[-0.02em] text-black/45">
                            Current preference:{" "}
                            {current === "accepted" ? "All cookies" : "Necessary only"}
                        </p>
                    ) : null}
                </div>

                <div className="grid w-full shrink-0 grid-cols-2 gap-3 md:w-[min(100%,22rem)]">
                    <button
                        type="button"
                        onClick={() => choose("accepted")}
                        className="w-full bg-accent px-4 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Accept cookies
                    </button>
                    <button
                        type="button"
                        onClick={() => choose("necessary")}
                        className="w-full border border-black/15 bg-transparent px-4 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#353535] transition-colors hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                        Necessary only
                    </button>
                </div>
            </div>
        </div>
    );
}
