import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
    return (
        <section className="pt-[72px] py-section-sm lg:py-section">
            <Container className="text-center">
                <h1 className="text-[clamp(4rem,10vw,8rem)] font-semibold tracking-[-0.04em] leading-none text-text-primary/20">
                    404
                </h1>
                <h2 className="text-2xl font-semibold mt-6">Page Not Found</h2>
                <p className="text-text-secondary mt-3 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-bg font-medium rounded-[4px] text-sm hover:bg-accent hover:text-white transition-colors duration-300 mt-8"
                >
                    Back to Home
                </Link>
            </Container>
        </section>
    );
}
