"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isContact = pathname === "/contact";

    if (isAdmin) {
        return <main className="h-screen overflow-hidden">{children}</main>;
    }

    if (isContact) {
        return (
            <>
                <Header />
                <div className="grid min-h-dvh grid-rows-[1fr_auto] bg-[#EAE4DD] text-black">
                    <main className="flex min-h-0 flex-col justify-start pt-6 md:justify-center md:pt-0">
                        {children}
                    </main>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="grid min-h-dvh grid-rows-[1fr_auto]">
                <main className="flex min-h-0 flex-col">{children}</main>
                <Footer />
            </div>
        </>
    );
}
