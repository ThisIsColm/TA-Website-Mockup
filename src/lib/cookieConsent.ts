/**
 * Cookie consent helpers.
 *
 * Stores the user's choice in localStorage and broadcasts changes through
 * window events so the GoogleAnalytics component (and anything else that
 * cares about consent) can react without prop drilling.
 *
 * Public wording is "cookies" — the actual behaviour gates Google Analytics.
 */

export type ConsentValue = "accepted" | "necessary";

const STORAGE_KEY = "tinyark.cookie-consent";
const CHANGE_EVENT = "tinyark:cookie-consent-change";
const OPEN_EVENT = "tinyark:open-cookie-settings";

/** Read the stored choice. Returns `null` if the user hasn't decided yet. */
export function getStoredConsent(): ConsentValue | null {
    if (typeof window === "undefined") return null;
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        if (value === "accepted" || value === "necessary") return value;
        return null;
    } catch {
        return null;
    }
}

/** Persist the user's choice and broadcast it. */
export function setStoredConsent(value: ConsentValue): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
        // localStorage may be disabled (Safari private mode etc.) — silently skip.
    }
    window.dispatchEvent(
        new CustomEvent<ConsentValue>(CHANGE_EVENT, { detail: value })
    );
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(
    listener: (value: ConsentValue) => void
): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = (event: Event) => {
        const detail = (event as CustomEvent<ConsentValue>).detail;
        if (detail === "accepted" || detail === "necessary") listener(detail);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/** Re-open the cookie banner (used by the "Cookie settings" footer link). */
export function openCookieSettings(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Listen for requests to open the banner. Returns an unsubscribe function. */
export function onOpenCookieSettings(listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = () => listener();
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
}
