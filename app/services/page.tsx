import Link from "next/link";

export const metadata = {
  title: "Services - Business Process Streamlining | Colin Young",
  description:
    "Custom booking systems, admin tools, and web apps that streamline business processes. West Scotland.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <div className="mb-12">
        <Link
          href="/"
          className="text-accent hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="text-4xl md:text-5xl font-normal mt-4">
          Business Process Streamlining
        </h1>
      </div>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <p className="text-lg">
          If spreadsheets, manual admin, and clunky systems are slowing you
          down, you&apos;re not alone. I build custom tools that fit how you
          actually work — booking systems, workflow tools, and web apps that
          replace the repetitive stuff nobody should be doing by hand.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            What I do
          </h2>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <strong className="text-foreground">Custom booking systems</strong>{" "}
              — tailored to your workflow, not generic widgets that almost fit
            </li>
            <li>
              <strong className="text-foreground">Admin and workflow tools</strong>{" "}
              — replace spreadsheets and manual processes
            </li>
            <li>
              <strong className="text-foreground">Websites when needed</strong>{" "}
              — with optional support packages for updates and maintenance
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Support packages
          </h2>
          <p>
            For websites and web apps, I offer support packages that cover
            updates, hosting, fixes, and small changes. No need to track down a
            developer every time something needs tweaking — we keep things
            running smoothly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            How I work
          </h2>
          <p>
            We start with a chat. What&apos;s eating your time? What&apos;s
            frustrating you? From there we work out what actually needs building,
            and I build it. Simple as that.
          </p>
        </section>

        <p>
          Based on the West Coast of Scotland — if you&apos;re nearby or happy
          to work remotely, I&apos;d like to hear from you. Drop me an email via
          the footer.
        </p>

        <p>
          Curious what that looks like in practice? Have a look at my{" "}
          <Link href="/case-studies" className="text-accent hover:underline">
            case studies
          </Link>
          , including the{" "}
          <Link
            href="/case-studies/eat-cycling"
            className="text-accent hover:underline"
          >
            EAT Cycling booking system
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
