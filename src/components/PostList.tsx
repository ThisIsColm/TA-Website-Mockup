import { Post } from "@/types";
import PostCard from "./PostCard";

interface PostListProps {
    posts: Post[];
    columns?: 2 | 3;
}

export default function PostList({ posts, columns = 3 }: PostListProps) {
    const gridCols =
        columns === 2
            ? "grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20 lg:gap-y-32"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 lg:gap-y-24";

    return (
        <div className={`grid ${gridCols}`}>
            {posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
            ))}
        </div>
    );
}
