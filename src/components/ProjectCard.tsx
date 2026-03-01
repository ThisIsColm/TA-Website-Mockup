"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types";

interface ProjectCardProps {
    project: Project;
    index?: number;
    aspectRatio?: string;
}

export default function ProjectCard({ project, index = 0, aspectRatio = "aspect-[4/3]" }: ProjectCardProps) {
    return (
        <Link href={`/work/${project.slug}`} className="group block">
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
                {/* Image Container */}
                <div className={`relative ${aspectRatio} overflow-hidden rounded-[4px] bg-bg-card mb-3 lg:mb-4`}>
                    <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-0">
                    <h3 className="text-[22px] -mt-[6px] font-medium text-white group-hover:text-accent transition-colors duration-300 tracking-tight">
                        {project.title}
                    </h3>
                    <p className="text-[22px] -mt-[5px] text-white/50 leading-snug line-clamp-1">
                        {project.excerpt}
                    </p>
                </div>
            </motion.article>
        </Link>
    );
}
