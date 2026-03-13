/**
 * Scroll Reveal + Parallax Script
 *
 * - Intersection Observer para animaciones de scroll-reveal
 * - Parallax suave en elementos con data-parallax
 * - Throttled scroll listener para performance
 * - Respeta prefers-reduced-motion
 */

function initScrollEffects(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Scroll Reveal ────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (prefersReducedMotion) {
        // Sin animaciones: mostrar todo directamente
        revealElements.forEach((el) => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Solo animar una vez
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px', // Trigger un poco antes del viewport bottom
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // ─── Parallax ─────────────────────────────────────────────────
    const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');

    if (parallaxElements.length > 0) {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach((el) => {
                const speed = parseFloat(el.getAttribute('data-parallax') || '0.3');
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) * speed;

                el.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });

        // Calcular posición inicial
        updateParallax();
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollEffects);
} else {
    initScrollEffects();
}
