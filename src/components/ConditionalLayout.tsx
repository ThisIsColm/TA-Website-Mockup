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
                <div className="flex min-h-screen flex-col bg-[#EAE4DD] text-black">
                    <main className="flex min-h-0 flex-1 flex-col justify-start pt-6 md:justify-center md:pt-0">
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
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
