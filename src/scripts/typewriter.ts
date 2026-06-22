/**
 * Typewriter Effect Script
 *
 * Anima texto letra por letra con cursor parpadeante.
 * Se activa vía data-typewriter attribute en el elemento.
 * Respeta prefers-reduced-motion.
 */

function initTypewriter(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-typewriter]');

    elements.forEach((el) => {
        const text = el.getAttribute('data-typewriter') || el.textContent || '';
        const speed = parseInt(el.getAttribute('data-typewriter-speed') || '80', 10);

        if (prefersReducedMotion) {
            // Sin animación: mostrar texto completo
            el.textContent = text;
            return;
        }

        // Limpiar contenido
        el.textContent = '';

        // Contenedor para el texto escrito
        const textSpan = document.createElement('span');
        el.appendChild(textSpan);

        // Cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor blinking'; // Start as blinking during initial delay
        cursor.setAttribute('aria-hidden', 'true');
        el.appendChild(cursor);

        // Parse text as JSON array if possible
        let strings: string[] = [];
        try {
            const parsed = JSON.parse(text);
            strings = Array.isArray(parsed) ? parsed : [text];
        } catch {
            strings = [text];
        }

        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentString = strings[stringIndex];
            let isTransition = false;
            let typeSpeed = speed;

            if (isDeleting) {
                charIndex--;
                if (charIndex === 0) {
                    isTransition = true;
                    isDeleting = false;
                    stringIndex = (stringIndex + 1) % strings.length;
                    typeSpeed = 500; // Pausa corta antes de empezar a escribir la siguiente palabra
                } else {
                    typeSpeed /= 2; // Borrar más rápido
                }
            } else {
                charIndex++;
                if (charIndex === currentString.length) {
                    if (strings.length > 1) {
                        isTransition = true;
                        typeSpeed = 3000; // Esperar 3 segundos antes de empezar a borrar
                        isDeleting = true;
                    }
                }
            }

            textSpan.textContent = currentString.substring(0, charIndex);

            // Safari performance optimization: toggle blinking only when paused/idle
            // to avoid rendering and layout thrashing during active DOM updates
            if (isTransition) {
                cursor.classList.add('blinking');
            } else {
                cursor.classList.remove('blinking');
            }

            setTimeout(type, typeSpeed);
        };

        // Observar el elemento para iniciar cuando sea visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Delay initial typing start, keep blinking during delay
                        setTimeout(() => {
                            cursor.classList.remove('blinking');
                            type();
                        }, 500);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.2 } // Lower threshold for responsive activation on mobile viewports
        );

        observer.observe(el);
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
    initTypewriter();
}
