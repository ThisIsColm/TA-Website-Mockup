export interface Project {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    tags: string[];
    date: string;
    year: string;
    role: string;
    services: string[];
    tools: string[];
    content: string;
    galleryImages: string[];
}

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    coverImage: string;
    category: string;
    content: string;
}
