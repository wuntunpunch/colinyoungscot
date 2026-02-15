import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-muted/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
          <Link
            href="/"
            className="text-foreground/80 hover:text-accent transition-colors"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-foreground/80 hover:text-accent transition-colors"
          >
            Services
          </Link>
          <Link
            href="/projects"
            className="text-foreground/80 hover:text-accent transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/case-studies"
            className="text-foreground/80 hover:text-accent transition-colors"
          >
            Case Studies
          </Link>
        </nav>
        <a
          href="mailto:colin@colinyoung.scot"
          className="text-accent hover:underline text-sm"
        >
          colin@colinyoung.scot
        </a>
      </div>
    </footer>
  );
}
