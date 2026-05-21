import Image from "next/image";

const COG_ICON = "/images/insights-cog-head.png";

interface InsightsIntroIconProps {
    className?: string;
    style?: React.CSSProperties;
}

/** Figma: 204×204px cog/head mark (`002_Cog Rotation_Head_-0027.png`). */
export default function InsightsIntroIcon({
    className,
    style,
}: InsightsIntroIconProps) {
    return (
        <Image
            src={COG_ICON}
            alt=""
            width={204}
            height={204}
            priority
            className={className}
            style={style}
        />
    );
}
