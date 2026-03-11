/**
 * Custom sitemap.xml — /sitemap.xml
 *
 * Genera un sitemap XML estándar con:
 * - Todas las páginas principales (home, blog, faq, privacy, terms)
 * - Todos los artículos del blog
 * - Hreflang alternates para cada URL (es, en, pt)
 * - Prerendered para servirse como archivo estático
 */
export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://rolivstudio.com';
const LOCALES = ['es', 'en', 'pt'] as const;

// Prioridades y frecuencias por tipo de página
const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },       // home
  { path: 'blog/', priority: '0.8', changefreq: 'weekly' },
  { path: 'faq/', priority: '0.6', changefreq: 'monthly' },
  { path: 'privacy/', priority: '0.3', changefreq: 'yearly' },
  { path: 'terms/', priority: '0.3', changefreq: 'yearly' },
];

function hreflangAlternates(path: string): string {
  return LOCALES.map(lang =>
    `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}/${lang}/${path}"/>`
  ).join('\n') +
  `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/${path}"/>`;
}

export const GET: APIRoute = async () => {
  const blogPosts = await getCollection('blog');
  const blogSlugs = [...new Set(blogPosts.map(p => p.slug))];

  const now = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_PAGES.flatMap(page =>
    LOCALES.map(lang => `
  <url>
    <loc>${SITE}/${lang}/${page.path}</loc>
${hreflangAlternates(page.path)}
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  );

  const blogUrls = blogSlugs.flatMap(slug =>
    LOCALES.map(lang => `
  <url>
    <loc>${SITE}/${lang}/blog/${slug}/</loc>
${hreflangAlternates(`blog/${slug}/`)}
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls.join('')}
${blogUrls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
