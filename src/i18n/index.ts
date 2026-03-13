/**
 * Sistema de internacionalización (i18n)
 *
 * - 3 locales: ES (default), EN, PT
 * - Traducciones planas en archivos JSON
 * - Detección de idioma por Accept-Language → localStorage → default
 * - Helpers para URLs y traducciones
 */

import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';

// ─── Tipos y constantes ─────────────────────────────────────────────
export const locales = ['es', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

// Mapa de traducciones indexado por locale
const translations: Record<Locale, Record<string, string>> = { es, en, pt };

// ─── Función de traducción ──────────────────────────────────────────
/**
 * Obtiene una traducción por clave. Retorna la clave si no existe.
 * @example t('es', 'nav.home') → "Inicio"
 */
export function t(locale: Locale, key: string): string {
    return translations[locale]?.[key] ?? translations[defaultLocale]?.[key] ?? key;
}

// ─── Helpers de locale ──────────────────────────────────────────────
/**
 * Valida si un string es un locale soportado
 */
export function isValidLocale(lang: string): lang is Locale {
    return locales.includes(lang as Locale);
}

/**
 * Extrae el locale del pathname actual
 * @example getLocaleFromPath('/en/blog') → 'en'
 */
export function getLocaleFromPath(pathname: string): Locale {
    const segment = pathname.split('/').filter(Boolean)[0];
    return isValidLocale(segment ?? '') ? (segment as Locale) : defaultLocale;
}

/**
 * Genera la URL equivalente en otro idioma
 * @example getLocalizedPath('/es/blog', 'en') → '/en/blog'
 */
export function getLocalizedPath(currentPath: string, targetLocale: Locale): string {
    const segments = currentPath.split('/').filter(Boolean);
    // Reemplazar el primer segmento (locale) o insertarlo
    if (segments.length > 0 && isValidLocale(segments[0])) {
        segments[0] = targetLocale;
    } else {
        segments.unshift(targetLocale);
    }
    return '/' + segments.join('/') + '/';
}

/**
 * Detecta el locale preferido del navegador (client-side)
 * Prioridad: localStorage → navigator.language → default
 */
export function detectLocale(): Locale {
    // Este código solo corre en el cliente
    if (typeof window === 'undefined') return defaultLocale;

    // 1. Preferencia guardada en localStorage
    const stored = localStorage.getItem('preferred-locale');
    if (stored && isValidLocale(stored)) return stored;

    // 2. Preferencia del navegador (Accept-Language)
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && isValidLocale(browserLang)) return browserLang;

    // 3. Default
    return defaultLocale;
}

// ─── Nombres de locales para el UI ──────────────────────────────────
export const localeNames: Record<Locale, string> = {
    es: 'Español',
    en: 'English',
    pt: 'Português',
};

export const localeFlags: Record<Locale, string> = {
    es: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-[18px] h-[18px]"><mask id="es-mask"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#es-mask)"><path fill="#ffce00" d="M0 111.3h512V400H0z"/><path fill="#d52b1e" d="M0 0h512v111.3H0zM0 400h512v112H0z"/></g></svg>',
    en: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-[18px] h-[18px]"><mask id="us-mask"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#us-mask)"><path fill="#eee" d="M256 0h256v64H256zM256 128h256v64H256zM256 256h256v64H256zM256 384h256v64H256z"/><path fill="#d80027" d="M256 64h256v64H256zM256 192h256v64H256zM256 320h256v64H256zM256 448h256v64H256z"/><path fill="#eee" d="M0 256h256v64H0zM0 384h256v64H0z"/><path fill="#d80027" d="M0 320h256v64H0zM0 448h256v64H0z"/><path fill="#0052b4" d="M0 0h256v256H0z"/><g fill="#eee"><circle cx="42.7" cy="42.7" r="14.2"/><circle cx="128" cy="42.7" r="14.2"/><circle cx="213.3" cy="42.7" r="14.2"/><circle cx="85.3" cy="85.3" r="14.2"/><circle cx="170.7" cy="85.3" r="14.2"/><circle cx="42.7" cy="128" r="14.2"/><circle cx="128" cy="128" r="14.2"/><circle cx="213.3" cy="128" r="14.2"/><circle cx="85.3" cy="170.7" r="14.2"/><circle cx="170.7" cy="170.7" r="14.2"/><circle cx="42.7" cy="213.3" r="14.2"/><circle cx="128" cy="213.3" r="14.2"/><circle cx="213.3" cy="213.3" r="14.2"/></g></g></svg>',
    pt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-[18px] h-[18px]"><mask id="br-mask"><circle cx="256" cy="256" r="256" fill="#fff"/></mask><g mask="url(#br-mask)"><path fill="#6da544" d="M0 0h512v512H0z"/><path fill="#ffda44" d="M256 42.7L42.7 256 256 469.3 469.3 256z"/><circle cx="256" cy="256" r="139.6" fill="#0052b4"/><path fill="#eee" d="M123.6 295.4c17.6-67 114-106.7 186.2-76 19.3 8.3 36.4 20.3 50.7 35-18.3-64.8-112-101.4-182.2-72.2C150.8 194.5 129.5 240.6 123.6 295.4z"/></g></svg>',
};
