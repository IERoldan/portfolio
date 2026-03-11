// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// Locales soportados para generación de sitemap multiidioma
const locales = ['es', 'en', 'pt'];

export default defineConfig({
  // IMPORTANTE: Cambiar a tu dominio real antes de deploy
  site: 'https://tudominio.com',

  // Server mode: todas las páginas usan prerender por defecto (estáticas),
  // excepto endpoints marcados con prerender = false (chatbot API)
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  // Tailwind CSS v4 via Vite plugin
  vite: {
    plugins: [tailwindcss()],
  },

  // Security headers applied to all server responses
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  // Integración sitemap con soporte multiidioma
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
          pt: 'pt-BR',
        },
      },
    }),
  ],

  // Configuración de i18n nativa de Astro
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: true, // /es/ en lugar de /
    },
  },
});