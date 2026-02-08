import { getAllCaseStudies } from "@/lib/case-studies";
import CaseStudyCard from "@/components/CaseStudyCard";
import Link from "next/link";

export const metadata = {
  title: "Case Studies - Colin Young",
  description: "Case studies of custom web applications and business solutions I've built.",
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <main className="min-h-screen px-6 py-20 max-w-6xl mx-auto">
      <div className="mb-12">
        <Link
          href="/"
          className="text-accent hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="text-4xl md:text-5xl font-normal mt-4">Case Studies</h1>
      </div>

      {caseStudies.length === 0 ? (
        <p className="text-foreground/60">No case studies yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} {...caseStudy} />
          ))}
        </div>
      )}
    </main>
  );
}
