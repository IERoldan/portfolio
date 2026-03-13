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
        cursor.className = 'typewriter-cursor';
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

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            textSpan.textContent = currentString.substring(0, charIndex);

            let typeSpeed = speed;

            if (isDeleting) {
                typeSpeed /= 2; // Borrar más rápido
            }

            if (!isDeleting && charIndex === currentString.length) {
                if (strings.length > 1) {
                    typeSpeed = 3000; // Esperar 3 segundos antes de borrar
                    isDeleting = true;
                }
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typeSpeed = 500; // Pausa antes de escribir la siguiente palabra
            }

            setTimeout(type, typeSpeed);
        };

        // Observar el elemento para iniciar cuando sea visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(type, 500); // Pequeño delay antes de empezar
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
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
