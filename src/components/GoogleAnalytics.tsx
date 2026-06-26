"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, onConsentChange } from "@/lib/cookieConsent";

interface GoogleAnalyticsProps {
    gaId: string;
}

/**
 * Loads Google Analytics (gtag) only after the user has accepted cookies.
 *
 * Behaviour:
 * - Default state (no stored choice or "necessary"): gtag scripts are NOT
 *   injected and the standard `ga-disable-<id>` opt-out flag is set, so no
 *   pageview or event is ever sent.
 * - When the user clicks "Accept cookies": the consent module dispatches a
 *   change event, this component flips state, the scripts mount, and gtag's
 *   `config` call fires the initial pageview.
 * - When the user later switches back to "Necessary cookies only": the
 *   `ga-disable-<id>` flag is re-enabled so any further hits (including from
 *   already-loaded scripts) are suppressed, and the scripts are removed for
 *   future page loads.
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const apply = (value: "accepted" | "necessary" | null) => {
            if (value === "accepted") {
                setGaDisabled(gaId, false);
                setEnabled(true);
            } else {
                setGaDisabled(gaId, true);
                setEnabled(false);
            }
        };

        apply(getStoredConsent());
        return onConsentChange(apply);
    }, [gaId]);

    if (!enabled) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `}
            </Script>
        </>
    );
}

/** Standard Google opt-out flag — set to true to halt all gtag activity. */
function setGaDisabled(gaId: string, disabled: boolean): void {
    if (typeof window === "undefined") return;
    const key = `ga-disable-${gaId}`;
    (window as unknown as Record<string, boolean>)[key] = disabled;
}
