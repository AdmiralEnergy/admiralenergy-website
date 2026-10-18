import fs from "fs";
import path from "path";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

const FRONTMATTER_KEYS = new Set([
  "title",
  "date",
  "excerpt",
  "author",
  "category",
  "ctaHref",
  "ctaLabel",
]);

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {} as Record<string, string>, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    if (!FRONTMATTER_KEYS.has(key)) continue;
    const rawValue = line.slice(separator + 1).trim();
    if (!rawValue) continue;

    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      try {
        const parsed = JSON.parse(rawValue);
        if (typeof parsed === "string") data[key] = parsed;
      } catch {
        throw new Error(`Invalid quoted frontmatter value for ${key}`);
      }
    } else {
      data[key] = rawValue;
    }
  }

  return { data, content: raw.slice(match[0].length) };
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  ctaHref: string;
  ctaLabel: string;
  readingTime: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const rt = readingTime(content);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      author: data.author ?? "Admiral Energy Team",
      category: data.category ?? "General",
      ctaHref: data.ctaHref ?? "/resources",
      ctaLabel: data.ctaLabel ?? "Explore Backup Power Resources",
      readingTime: rt.text,
      content,
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
