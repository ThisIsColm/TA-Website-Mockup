"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Post } from "@/types";

interface PostCardProps {
    post: Post;
    index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/case-studies/${post.slug}`} className="group block">
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
                viewport={{ once: true, margin: "-60px" }}
            >
                {/* Content Container - Increased gap between Image and Meta */}
                <div className="flex flex-col gap-6">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-card">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-[var(--zoom-scale)] transition-transform duration-[var(--zoom-duration)] ease-out"
                        />
                    </div>

                    {/* Meta - Internal spacing remains gap-4 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <span className="text-sm text-text-tertiary uppercase tracking-wider">
                                {formattedDate}
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 leading-none">
                                {post.title}
                            </h3>
                            <p className="text-sm md:text-base text-text-secondary leading-relaxed line-clamp-2">
                                {post.excerpt}
                            </p>
                        </div>

                        {post.category && (
                            <div className="flex flex-wrap gap-2">
                                <span
                                    className="px-3 py-1 text-[10px] md:text-xs font-medium border border-white/20 text-white/70 uppercase tracking-wider"
                                >
                                    {post.category}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
