import fs from "fs";
import path from "path";

const CAROUSEL_DIR = path.join(
    process.cwd(),
    "public/images/about/about-images"
);

/** Web paths for contact-page BTS carousel (reads from public/images/about/about-images). */
export function getContactCarouselImages(): string[] {
    if (!fs.existsSync(CAROUSEL_DIR)) {
        return ["/images/contact/fontaines.jpg"];
    }

    return fs
        .readdirSync(CAROUSEL_DIR)
        .filter((name) => /\.jpe?g$/i.test(name))
        .sort((a, b) => a.localeCompare(b))
        .map((name) => `/images/about/about-images/${encodeURIComponent(name)}`);
}
