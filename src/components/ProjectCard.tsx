"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types";
import Badge from "./Badge";
import { useState } from "react";
import VimeoPreview from "./VimeoPreview";

interface ProjectCardProps {
    project: Project;
    index?: number;
    aspectRatio?: string;
    enablePreview?: boolean;
    overlayTitleOnThumbnail?: boolean;
    compactOverlayTitle?: boolean;
}

export default function ProjectCard({
    project,
    index = 0,
    aspectRatio = "aspect-[16/9]",
    enablePreview = false,
    overlayTitleOnThumbnail = false,
    compactOverlayTitle = false,
}: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const titleWords = project.title.trim().split(/\s+/);

    const showPreview = enablePreview && !!project.vimeoId;

    return (
        <Link
            href={`/work/${project.slug}`}
            className="group block active:scale-[0.98] transition-transform duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
                viewport={{ once: true, margin: "-60px" }}
                className="relative"
            >
                <div className="flex flex-col gap-6">
                    {/* Thumbnail container */}
                    <div className={`relative ${aspectRatio} overflow-hidden bg-bg-card`}>
                        {/* Static thumbnail — fades out once video is playing */}
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={`object-cover transition-all duration-500 ease-out ${!showPreview && isHovered
                                    ? "scale-[var(--zoom-scale)]"
                                    : "scale-100"
                                }`}
                        />

                        {/* Video preview overlay (always rendered when vimeoId exists to allow preload) */}
                        {showPreview && (
                            <VimeoPreview
                                vimeoId={project.vimeoId!}
                                isHovered={isHovered}
                            />
                        )}

                        {overlayTitleOnThumbnail && (
                            <>
                                <div
                                    className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t transition-all duration-300 ${isHovered
                                            ? "h-30 md:h-36 from-black/72 via-black/28 to-transparent"
                                            : "h-24 md:h-28 from-black/46 via-black/14 to-transparent"
                                        }`}
                                />
                                <div
                                    className="absolute left-4 md:left-5 bottom-4 md:bottom-5 z-20 max-w-[82%]"
                                >
                                    <div className={`transition-transform duration-300 ${isHovered ? "-translate-y-2" : "translate-y-0"}`}>
                                        <motion.h3
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-60px" }}
                                            variants={{
                                                hidden: {},
                                                visible: {
                                                    transition: {
                                                        delayChildren: index * 0.05 + 0.08,
                                                        staggerChildren: 0.06,
                                                    },
                                                },
                                            }}
                                            className={`text-white font-black tracking-[-0.02em] uppercase leading-[0.98] ${compactOverlayTitle
                                                    ? "text-[clamp(0.95rem,1.7vw,1.35rem)]"
                                                    : "text-[clamp(1.15rem,2.2vw,1.85rem)]"
                                                }`}
                                        >
                                            {titleWords.map((word, wordIndex) => (
                                                <motion.span
                                                    key={`${word}-${wordIndex}`}
                                                    variants={{
                                                        hidden: { opacity: 0, y: 14, clipPath: "inset(0 0 100% 0)" },
                                                        visible: {
                                                            opacity: 1,
                                                            y: 0,
                                                            clipPath: "inset(0 0 0% 0)",
                                                            transition: {
                                                                duration: 0.45,
                                                                ease: [0.25, 0.4, 0.25, 1],
                                                            },
                                                        },
                                                    }}
                                                    className="inline-block mr-[0.28em]"
                                                >
                                                    {word}
                                                </motion.span>
                                            ))}
                                        </motion.h3>
                                    </div>
                                    <p
                                        className={`text-[0.98rem] md:text-[1.03rem] leading-snug text-white/90 line-clamp-2 overflow-hidden transition-all duration-300 ${isHovered ? "mt-2 max-h-16 opacity-100 translate-y-0" : "mt-0 max-h-0 opacity-0 translate-y-2"
                                            }`}
                                    >
                                        {project.excerpt}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {!overlayTitleOnThumbnail && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 tracking-tight leading-none text-balance">
                                    {project.title}
                                </h3>
                                <p className="text-base md:text-lg text-text-secondary leading-relaxed line-clamp-2">
                                    {project.excerpt}
                                </p>
                            </div>

                            {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <Badge>{project.tags[0]}</Badge>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.article>
        </Link>
    );
}
