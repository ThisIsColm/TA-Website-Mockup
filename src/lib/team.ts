/**
 * Team members selectable as insight article authors (admin + article header).
 * Portrait paths align with `/images/team/` assets on the About page.
 */

export type TeamAuthorId =
    | "nathan"
    | "gabi"
    | "mark"
    | "eilis"
    | "leon"
    | "blaine"
    | "colm"
    | "rory"
    | "bea"
    | "kate"
    | "rosie"
    | "aj";

export interface TeamAuthor {
    id: TeamAuthorId;
    name: string;
    /** First portrait frame for author byline (`_001`). */
    photoPrefix?: string;
    photos?: string[];
}

export const TEAM_AUTHORS: TeamAuthor[] = [
    { id: "nathan", name: "Nathan Reilly" },
    { id: "gabi", name: "Gabi Chrobak" },
    { id: "mark", name: "Mark O'Brien", photoPrefix: "Mark" },
    { id: "eilis", name: "Eilis Doherty", photoPrefix: "Eilis" },
    { id: "leon", name: "Leon Forristal", photoPrefix: "Leon" },
    { id: "blaine", name: "Blaine Rennicks" },
    { id: "colm", name: "Colm Moore", photoPrefix: "Colm" },
    { id: "rory", name: "Rory Bradley", photoPrefix: "Rory" },
    { id: "bea", name: "Beatriz Gonçalves", photoPrefix: "Bea" },
    { id: "kate", name: "Kate Brady", photoPrefix: "Kate" },
    { id: "rosie", name: "Rosie Spearing", photoPrefix: "Rosie" },
    {
        id: "aj",
        name: "Alex James",
        photos: [
            "/images/team/Aj_001.jpg",
            "/images/team/Aj_002.jpg",
            "/images/team/AJ_003.jpg",
        ],
    },
];

const authorById = new Map(TEAM_AUTHORS.map((a) => [a.id, a]));

export function getTeamAuthor(id: string | null | undefined): TeamAuthor | null {
    if (!id) return null;
    return authorById.get(id as TeamAuthorId) ?? null;
}

export function getAuthorPortraitSrc(author: TeamAuthor): string | null {
    if (author.photos?.[0]) return author.photos[0];
    if (author.photoPrefix) {
        return `/images/team/${author.photoPrefix}_001.jpg`;
    }
    return null;
}

export function isTeamAuthorId(value: string): value is TeamAuthorId {
    return authorById.has(value as TeamAuthorId);
}
