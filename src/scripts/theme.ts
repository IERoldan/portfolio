/**
 * Theme Toggle Script (Dark / Light mode)
 *
 * Prioridad de detección:
 * 1. localStorage ('theme')
 * 2. prefers-color-scheme del sistema
 * 3. Default: light
 *
 * Persiste la preferencia en localStorage.
 * Aplica/quita la clase .dark en <html>.
 */

function initTheme(): void {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default: light. Solo dark si el usuario lo eligió o su OS lo prefiere
    const isDark = stored ? stored === 'dark' : prefersDark;

    document.documentElement.classList.toggle('dark', isDark);
    updateToggleIcons(isDark);
}

function toggleTheme(): void {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcons(isDark);
}

function updateToggleIcons(isDark: boolean): void {
    const sunIcon = document.getElementById('theme-sun');
    const moonIcon = document.getElementById('theme-moon');
    if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
    }
}

// Inicializar al cargar
initTheme();

// Exponer toggle globalmente para el botón
(window as any).__toggleTheme = toggleTheme;
