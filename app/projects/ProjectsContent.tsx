"use client";

import { useState } from "react";
import Link from "next/link";

interface Project {
  title: string;
  description: string;
  url?: string;
  comingSoon?: boolean;
}

const projects: {
  category: string;
  items: Project[];
}[] = [
  {
    category: "Web Pages",
    items: [
      {
        title: "Largs Piano Lessons",
        description:
          "My piano teaching website where I offer lessons and share resources for students.",
        url: "https://largspianolessons.com",
      },
      {
        title: "EAT Cycling",
        description:
          "Bike servicing business website providing information about services and booking.",
        url: "https://eatcycling.co.uk",
      },
    ],
  },
  {
    category: "Web Apps",
    items: [
      {
        title: "WOD Clock",
        description:
          "Fitness timers for your workouts. Including Tabata, EMOM, HIIT and AMRAPs. Fully customisable and you can save your favourites.",
        url: "https://wodclock.app/",
      },
      {
        title: "Gomoku",
        description:
          "Playable Gomoku game with weekly leaderboards and guides.",
        url: "https://gomoku.fun",
      },
      {
        title: "Music Theory Quest",
        description:
          "Interactive music theory games and quizzes including interval training, note identification, chord recognition, and rhythm challenges.",
        url: "https://mytheoryquest.app/",
      },
      {
        title: "EAT Cycling Booking",
        description:
          "Custom booking system for EAT Cycling with dual-use functionality for customers and staff, integrated with Google Calendar and WhatsApp.",
        url: "https://book.eatcycling.co.uk",
      },
    ],
  },
  {
    category: "Apps",
    items: [
      {
        title: "Coming Soon",
        description: "Mobile applications are in development.",
        comingSoon: true,
      },
    ],
  },
];

type FilterCategory = "All" | "Web Pages" | "Web Apps" | "Apps";

export default function ProjectsContent() {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("All");

  const categories: FilterCategory[] = ["All", "Web Pages", "Web Apps", "Apps"];

  const filteredProjects = projects.filter((section) =>
    selectedFilter === "All" ? true : section.category === selectedFilter
  );

  return (
    <main className="min-h-screen px-6 py-20 max-w-6xl mx-auto">
      <div className="mb-12">
        <Link
          href="/"
          className="text-accent hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-normal">Projects</h1>
            <p className="text-accent text-base mt-2">Click tile to visit</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  selectedFilter === category
                    ? "bg-accent text-background"
                    : "bg-[#0a0a0a] border border-muted text-foreground hover:border-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((section) =>
          section.items.map((project, index) =>
            project.url && !project.comingSoon ? (
              <a
                key={`${section.category}-${index}`}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 border border-muted rounded-lg hover:border-accent transition-colors group bg-[#0a0a0a]"
              >
                <div className="mb-2">
                  <span className="text-sm text-accent uppercase tracking-wide">
                    {section.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="leading-relaxed text-[rgba(246,246,246,0.8)]">
                  {project.description}
                </p>
              </a>
            ) : (
              <div
                key={`${section.category}-${index}`}
                className="p-6 border border-muted rounded-lg bg-[#0a0a0a]"
              >
                <div className="mb-2">
                  <span className="text-sm text-accent uppercase tracking-wide">
                    {section.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="leading-relaxed text-[rgba(246,246,246,0.8)]">
                  {project.description}
                </p>
                <span className="text-muted">Coming soon</span>
              </div>
            )
          )
        )}
      </div>
    </main>
  );
}
