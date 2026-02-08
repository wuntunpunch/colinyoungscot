import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface CaseStudyMetadata {
  title: string;
  description: string;
  date?: string;
  slug: string;
}

export interface CaseStudy extends CaseStudyMetadata {
  content: string;
}

const caseStudiesDirectory = path.join(process.cwd(), "content/case-studies");

export function getAllCaseStudies(): CaseStudyMetadata[] {
  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
  const allCaseStudies = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(caseStudiesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || fileName.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date,
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  return allCaseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: data.slug || slug,
    title: data.title || "Untitled",
    description: data.description || "",
    date: data.date,
    content,
  };
}

export function getAllCaseStudySlugs(): string[] {
  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
