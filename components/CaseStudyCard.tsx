import Link from "next/link";

interface CaseStudyCardProps {
  title: string;
  description: string;
  date?: string;
  slug: string;
}

export default function CaseStudyCard({
  title,
  description,
  date,
  slug,
}: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-studies/${slug}`}
      className="block p-6 border border-muted rounded-lg hover:border-accent transition-colors group bg-[#0a0a0a]"
    >
      <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="leading-relaxed text-[rgba(246,246,246,0.8)]">
        {description}
      </p>
    </Link>
  );
}
