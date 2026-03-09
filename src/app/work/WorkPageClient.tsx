"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Category = {
    title: string;
    slug: string;
    image: string;
};

export default function WorkPageClient({ categories }: { categories: Category[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 mt-16 md:mt-24">
            {categories.map((c, index) => (
                <motion.div
                    key={c.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    viewport={{ once: true, margin: "-60px" }}
                >
                    <Link
                        href={`/work?category=${c.slug}`}
                        className="group block active:scale-[0.98] transition-transform duration-200"
                    >
                        <div className="relative aspect-[16/10] overflow-hidden bg-bg-card mb-4">
                            <Image
                                src={c.image}
                                alt={c.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover group-hover:scale-[var(--zoom-scale)] transition-transform duration-[var(--zoom-duration)] ease-out"
                            />
                        </div>
                        <h3 className="text-[28px] md:text-[32px] font-bold text-white leading-[1] group-hover:text-accent transition-colors duration-300">
                            {c.title}
                        </h3>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
