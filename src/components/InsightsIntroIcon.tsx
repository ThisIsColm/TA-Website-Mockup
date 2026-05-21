import Image from "next/image";

const COG_ICON = "/images/insights-cog-head.png";

interface InsightsIntroIconProps {
    className?: string;
}

/** Figma: 204×204px cog/head mark (`002_Cog Rotation_Head_-0027.png`). */
export default function InsightsIntroIcon({ className }: InsightsIntroIconProps) {
    return (
        <Image
            src={COG_ICON}
            alt=""
            width={204}
            height={204}
            priority
            className={className}
        />
    );
}
