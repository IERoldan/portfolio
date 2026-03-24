// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rolivstudio.com',
  // Server mode: páginas prerender por defecto (estáticas),
  // excepto endpoints con prerender = false (chatbot API, root redirect)
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  // Tailwind CSS v4 via Vite plugin
  vite: {
    plugins: [tailwindcss()],
  },

  // Security headers
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  // Sitemap configuration
  integrations: [
    sitemap({
      xslURL: '/sitemap.xsl',
      filter: (page) => page !== 'https://rolivstudio.com/',
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
          pt: 'pt',
        },
      },
    }),
  ],

  // i18n nativa de Astro
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});