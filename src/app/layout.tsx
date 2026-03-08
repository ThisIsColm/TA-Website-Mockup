import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
    title: {
        default: "Tiny Ark",
        template: "%s — Tiny Ark",
    },
    description:
        "Tiny Ark is an award-winning, creative film production company. We're ready to bring your film project from concept to delivery.",
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
                <link rel="stylesheet" href="https://use.typekit.net/myb1dqi.css" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-bg text-text-primary font-sans">
                <SmoothScroll>
                    <ConditionalLayout>
                        {children}
                    </ConditionalLayout>
                </SmoothScroll>
            </body>
        </html>
    );
}
