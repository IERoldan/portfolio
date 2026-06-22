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
        let parallaxItems: Array<{ el: HTMLElement; topFromDoc: number; height: number; speed: number }> = [];

        // Hint Safari that these elements will transform to enable layer backing
        parallaxElements.forEach((el) => {
            el.style.willChange = 'transform';
        });

        const measure = () => {
            const scrollY = window.scrollY;
            parallaxItems = Array.from(parallaxElements).map((el) => {
                const rect = el.getBoundingClientRect();
                const topFromDoc = rect.top + scrollY;
                const speed = parseFloat(el.getAttribute('data-parallax') || '0.3');
                return { el, topFromDoc, height: rect.height, speed };
            });
        };

        const updateParallax = () => {
            const scrollY = window.scrollY;
            const viewportCenter = scrollY + window.innerHeight / 2;

            parallaxItems.forEach(({ el, topFromDoc, height, speed }) => {
                const centerY = topFromDoc + height / 2;
                const offset = (centerY - viewportCenter) * speed;

                // Force GPU layer composition with translate3d
                el.style.transform = `translate3d(0, ${offset}px, 0)`;
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        // Measure layout geometries
        measure();
        // Compute initial positioning
        updateParallax();

        window.addEventListener('scroll', onScroll, { passive: true });

        // Re-measure on window resize to ensure correctness if viewport or layout changes
        let resizeTimeout: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                measure();
                updateParallax();
            }, 150);
        }, { passive: true });
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollEffects);
} else {
    initScrollEffects();
}
