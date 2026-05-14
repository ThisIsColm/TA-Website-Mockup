import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Site-wide page container.
 *
 * Applies the design-system outer padding (`5.625vw`, matching the designer's
 * 1920px spec where outer = 108px). Padding scales proportionally with the
 * viewport so the same composition holds at every screen width.
 *
 * Use this on every page section that should respect the site's outer rule.
 */
export default function Container({
    children,
    className = "",
    as: Tag = "div",
}: ContainerProps) {
    return (
        <Tag className={`w-full px-[5.625vw] ${className}`}>
            {children}
        </Tag>
    );
}
