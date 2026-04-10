import CaseStudyPage, {
    generateStaticParams,
    generateMetadata,
} from "@/app/case-studies/[slug]/page";

export const dynamic = "force-dynamic";

export { generateStaticParams, generateMetadata };

export default CaseStudyPage;
