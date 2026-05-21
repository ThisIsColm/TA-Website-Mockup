import { buildTypographyStylesheet } from "@/lib/typographyStyles";

/** Injects typography CSS variables + utility classes from src/lib/typography.ts */
export default function TypographyStyles() {
    return (
        <style
            dangerouslySetInnerHTML={{ __html: buildTypographyStylesheet() }}
        />
    );
}
