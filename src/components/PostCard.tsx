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
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-bg-card mb-4">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[var(--zoom-scale)] transition-transform duration-[var(--zoom-duration)] ease-out"
                    />
                </div>

                {/* Date & Title */}
                <div className="flex flex-col gap-1">
                    <span className="text-[22px] leading-[1.2] mt-1 text-text-tertiary">
                        {formattedDate}
                    </span>
                    <h3 className="text-[22px] font-medium text-white leading-[1] mb-6 group-hover:text-accent transition-colors duration-300">
                        {post.title}
                    </h3>
                </div>
            </motion.article>
        </Link>
    );
}
