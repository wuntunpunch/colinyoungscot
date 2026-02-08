import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/case-studies";
import { parseMarkdown } from "@/lib/markdown-to-jsx";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCaseStudySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} - Case Study | Colin Young`,
    description: caseStudy.description,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const content = parseMarkdown(caseStudy.content);

  return (
    <article className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/case-studies"
          className="text-accent hover:underline mb-4 inline-block"
        >
          ← Back to case studies
        </Link>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          {caseStudy.title}
        </h1>
        {caseStudy.date && (
          <p className="text-sm" style={{ color: "rgba(246, 246, 246, 1)" }}>
            {new Date(caseStudy.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </header>

      <div className="prose prose-invert max-w-none">
        {content}
      </div>
    </article>
  );
}
