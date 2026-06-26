import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ConditionalLayout from "@/components/ConditionalLayout";
import TypographyStyles from "@/components/TypographyStyles";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsentBanner from "@/components/CookieConsentBanner";

const GA_MEASUREMENT_ID = "G-ZKTXN41D1R";

export const metadata: Metadata = {
    title: {
        default: "Tiny Ark",
        template: "%s — Tiny Ark",
    },
    description:
        "Tiny Ark is an award-winning, creative film production company. We're ready to bring your film project from concept to delivery.",
    icons: {
        icon: [
            { url: "/favicon/favicon.ico" },
            {
                url: "/favicon/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
        ],
        apple: "/favicon/apple-touch-icon.png",
    },
    openGraph: {
        title: "Tiny Ark",
        description:
            "Tiny Ark is an award-winning, creative film production company. We're ready to bring your film project from concept to delivery.",
        url: "www.tinyark.com",
        siteName: "Tiny Ark",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
                <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
                <link rel="stylesheet" href="https://use.typekit.net/myb1dqi.css" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-bg text-text-primary font-sans">
                <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
                <TypographyStyles />
                <SmoothScroll>
                    <ConditionalLayout>
                        {children}
                    </ConditionalLayout>
                </SmoothScroll>
                <CookieConsentBanner />
            </body>
        </html>
    );
}
