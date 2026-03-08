"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types";
import Badge from "./Badge";

interface ProjectCardProps {
    project: Project;
    index?: number;
    aspectRatio?: string;
}

export default function ProjectCard({ project, index = 0, aspectRatio = "aspect-[4/3]" }: ProjectCardProps) {
    return (
        <Link href={`/work/${project.slug}`} className="group block active:scale-[0.98] transition-transform duration-200">
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
                {/* Content Container - Increased gap between Image and Meta */}
                <div className="flex flex-col gap-6">
                    {/* Image Container */}
                    <div className={`relative ${aspectRatio} overflow-hidden bg-bg-card`}>
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-[var(--zoom-scale)] transition-transform duration-[var(--zoom-duration)] ease-out"
                        />
                    </div>

                    {/* Meta - Internal spacing remains gap-4 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 tracking-tight leading-none text-balance">
                                {project.title}
                            </h3>
                            <p className="text-sm md:text-base text-text-secondary leading-relaxed line-clamp-2">
                                {project.excerpt}
                            </p>
                        </div>

                        {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <Badge>{project.tags[0]}</Badge>
                            </div>
                        )}
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}
