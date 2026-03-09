export default function Badge({ children }: { children: React.ReactNode }) {
    if (!children) return null;
    return (
        <span className="px-3 py-1 text-xs font-medium border border-white/20 text-text-tertiary capitalize tracking-wider rounded-none">
            {children}
        </span>
    );
}
