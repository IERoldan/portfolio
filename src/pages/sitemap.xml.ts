/**
 * Custom sitemap.xml — /sitemap.xml
 *
 * Genera un sitemap XML estándar con hreflang alternates.
 */
export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://rolivstudio.com';
const LOCALES = ['es', 'en', 'pt'] as const;

const STATIC_PAGES = [
  { path: '',        priority: '1.0', changefreq: 'weekly'  },
  { path: 'blog/',   priority: '0.8', changefreq: 'weekly'  },
  { path: 'faq/',    priority: '0.6', changefreq: 'monthly' },
  { path: 'privacy/',priority: '0.3', changefreq: 'yearly'  },
  { path: 'terms/',  priority: '0.3', changefreq: 'yearly'  },
];

function buildUrlEntries(locPath: string, priority: string, changefreq: string, lastmod: string): string {
  const alternates = LOCALES.map(lang =>
    `        <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}/${lang}/${locPath}"/>`
  ).join('\n');
  const xDefault = `        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/${locPath}"/>`;

  return LOCALES.map(lang => `    <url>
        <loc>${SITE}/${lang}/${locPath}</loc>
${alternates}
${xDefault}
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`).join('\n');
}

export const GET: APIRoute = async () => {
  const blogPosts = await getCollection('blog');
  const blogSlugs = [...new Set(blogPosts.map(p => p.slug))];
  const lastmod = new Date().toISOString().split('T')[0];

  const urls: string[] = [];

  for (const page of STATIC_PAGES) {
    urls.push(buildUrlEntries(page.path, page.priority, page.changefreq, lastmod));
  }

  for (const slug of blogSlugs) {
    urls.push(buildUrlEntries(`blog/${slug}/`, '0.7', 'monthly', lastmod));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
