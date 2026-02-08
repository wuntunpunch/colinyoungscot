import React, { createElement } from "react";

interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  depth?: number;
  ordered?: boolean;
  start?: number;
  checked?: boolean;
  href?: string;
  title?: string;
  lang?: string;
}

// Simple markdown parser for basic formatting
export function parseMarkdown(markdown: string): React.ReactNode[] {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listOrdered = false;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(<p key={elements.length} className="mb-4 leading-relaxed">{parseInlineMarkdown(text)}</p>);
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const ListTag = listOrdered ? "ol" : "ul";
      elements.push(
        <ListTag key={elements.length} className="mb-4 ml-6 space-y-2 list-disc">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{parseInlineMarkdown(item)}</li>
          ))}
        </ListTag>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Horizontal rule
    if (line === "---") {
      flushParagraph();
      flushList();
      elements.push(
        <hr
          key={elements.length}
          className="my-8 border-muted"
          style={{
            color: "rgba(165, 217, 255, 1)",
            borderTopColor: "rgba(165, 217, 255, 1)",
          }}
        />
      );
      continue;
    }

      // Headers
      if (line.startsWith("#")) {
        flushParagraph();
        flushList();
        const match = line.match(/^(#+)\s+(.+)$/);
        if (match) {
          const level = Math.min(match[1].length, 6);
          const text = match[2];
          const tagName = `h${level}`;
          const className = level === 1 
            ? "text-4xl md:text-5xl font-semibold mb-6 mt-8" 
            : level === 2
            ? "text-3xl md:text-4xl font-semibold mb-4 mt-8"
            : level === 3
            ? "text-2xl md:text-3xl font-semibold mb-3 mt-6"
            : "text-xl md:text-2xl font-semibold mb-2 mt-4";
          elements.push(
            createElement(tagName, { key: elements.length, className }, parseInlineMarkdown(text))
          );
        }
        continue;
      }

    // Lists
    const listMatch = line.match(/^(\d+\.|\-|\*)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      const isOrdered = /^\d+\./.test(listMatch[1]);
      if (!inList || (isOrdered !== listOrdered)) {
        flushList();
        listOrdered = isOrdered;
        inList = true;
      }
      listItems.push(listMatch[2]);
      continue;
    }

    // Empty line
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Regular paragraph
    if (inList) {
      flushList();
    }
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return elements;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let keyCounter = 0;

  // Process links first (most specific)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linkMatches: Array<{ index: number; length: number; text: string; url: string }> = [];
  let match: RegExpExecArray | null;
  
  linkRegex.lastIndex = 0;
  while ((match = linkRegex.exec(text)) !== null) {
    linkMatches.push({
      index: match.index,
      length: match[0].length,
      text: match[1],
      url: match[2],
    });
  }

  // Process bold
  const boldRegex = /\*\*(.+?)\*\*/g;
  const boldMatches: Array<{ index: number; length: number; content: string }> = [];
  boldRegex.lastIndex = 0;
  while ((match = boldRegex.exec(text)) !== null) {
    // Skip if inside a link
    const isInsideLink = linkMatches.some(
      (lm) => match!.index >= lm.index && match!.index < lm.index + lm.length
    );
    if (!isInsideLink) {
      boldMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[1],
      });
    }
  }

  // Process italic (but not bold)
  const italicRegex = /\*(.+?)\*/g;
  const italicMatches: Array<{ index: number; length: number; content: string }> = [];
  italicRegex.lastIndex = 0;
  while ((match = italicRegex.exec(text)) !== null) {
    // Skip if inside a link or bold
    const isInsideLink = linkMatches.some(
      (lm) => match!.index >= lm.index && match!.index < lm.index + lm.length
    );
    const isInsideBold = boldMatches.some(
      (bm) => match!.index >= bm.index && match!.index < bm.index + bm.length
    );
    if (!isInsideLink && !isInsideBold) {
      italicMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[1],
      });
    }
  }

  // Process code
  const codeRegex = /`(.+?)`/g;
  const codeMatches: Array<{ index: number; length: number; content: string }> = [];
  codeRegex.lastIndex = 0;
  while ((match = codeRegex.exec(text)) !== null) {
    // Skip if inside a link, bold, or italic
    const isInsideLink = linkMatches.some(
      (lm) => match!.index >= lm.index && match!.index < lm.index + lm.length
    );
    const isInsideBold = boldMatches.some(
      (bm) => match!.index >= bm.index && match!.index < bm.index + bm.length
    );
    const isInsideItalic = italicMatches.some(
      (im) => match!.index >= im.index && match!.index < im.index + im.length
    );
    if (!isInsideLink && !isInsideBold && !isInsideItalic) {
      codeMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[1],
      });
    }
  }

  // Combine all matches and sort
  const allMatches: Array<{
    index: number;
    length: number;
    type: "link" | "bold" | "italic" | "code";
    content?: string;
    url?: string;
  }> = [
    ...linkMatches.map((m) => ({ ...m, type: "link" as const, content: m.text, url: m.url })),
    ...boldMatches.map((m) => ({ ...m, type: "bold" as const })),
    ...italicMatches.map((m) => ({ ...m, type: "italic" as const })),
    ...codeMatches.map((m) => ({ ...m, type: "code" as const })),
  ].sort((a, b) => a.index - b.index);

  // Build result
  let lastIndex = 0;
  allMatches.forEach((m) => {
    if (m.index > lastIndex) {
      parts.push(text.substring(lastIndex, m.index));
    }
    
    if (m.type === "link" && m.content && m.url) {
      parts.push(
        <a
          key={keyCounter++}
          href={m.url}
          className="text-accent hover:underline"
          target={m.url.startsWith("http") ? "_blank" : undefined}
          rel={m.url.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {m.content}
        </a>
      );
    } else if (m.type === "bold" && m.content) {
      parts.push(<strong key={keyCounter++}>{m.content}</strong>);
    } else if (m.type === "italic" && m.content) {
      parts.push(<em key={keyCounter++}>{m.content}</em>);
    } else if (m.type === "code" && m.content) {
      parts.push(
        <code key={keyCounter++} className="bg-muted px-1.5 py-0.5 rounded text-sm">
          {m.content}
        </code>
      );
    }
    
    lastIndex = m.index + m.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
