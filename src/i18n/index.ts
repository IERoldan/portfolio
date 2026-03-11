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
    es: '🇪🇸',
    en: '🇺🇸',
    pt: '🇧🇷',
};
