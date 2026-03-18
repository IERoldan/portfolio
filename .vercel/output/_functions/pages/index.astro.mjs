import { c as createAstro, a as createComponent } from '../chunks/astro/server_OaOt7Pi0.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://rolivstudio.com");
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("/es/");
}, "C:/Users/ivanr/OneDrive/Documentos/Por cuenta/sitios/portfolio_ivan/src/pages/index.astro", void 0);

const $$file = "C:/Users/ivanr/OneDrive/Documentos/Por cuenta/sitios/portfolio_ivan/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
