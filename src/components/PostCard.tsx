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
        <Link href={`/blog/${post.slug}`} className="group block">
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
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-bg-card mb-4">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-[4px] bg-bg-elevated text-text-secondary border border-border">
                        {post.category}
                    </span>
                    <span className="text-xs text-text-tertiary">{formattedDate}</span>
                </div>

                {/* Title & Excerpt */}
                <h3 className="text-lg font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                    {post.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1 line-clamp-4">
                    {post.excerpt}
                </p>
            </motion.article>
        </Link>
    );
}
