import { Project } from "@/types";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
            ))}
        </div>
    );
}
