import styles from './roksi4yk-services.module.css';

const services = [
  ['01', 'MAKEUP', 'Професійний макіяж', 'EVENTS · SHOOTINGS · SPECIAL MOMENTS', 'makeup-url'],
  ['02', 'CONSULTATIONS', 'Персональна beauty-консультація', 'KYIV · ONLINE', 'consultations-url'],
  ['03', 'EDUCATION', 'Навчання макіяжу', 'INDIVIDUAL · GROUP', 'education-url'],
  ['04', 'TEEN BEAUTY', 'Beauty для підлітків', 'CARE · TECHNIQUE · CONFIDENCE', 'teen-beauty-url'],
  ['05', 'BRAND & CONTENT', 'Beauty для брендів і контенту', 'CAMPAIGNS · CONTENT · COLLABORATIONS', 'brand-content-url'],
] as const;

function escapeHtml(value: string): string {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, character => entities[character] ?? character);
}

function safeDestination(value: string | null): string {
  const candidate = value?.trim();
  if (!candidate || candidate.startsWith('//') || /[\u0000-\u001f\u007f\\]/.test(candidate)) return '';

  try {
    const base = new URL(document.baseURI);
    const url = new URL(candidate, base);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    const absolute = /^[a-z][a-z\d+.-]*:/i.test(candidate);
    return absolute || url.origin === base.origin ? candidate : '';
  } catch {
    return '';
  }
}

class Roksi4ykServices extends HTMLElement {
  private observer?: IntersectionObserver;

  static get observedAttributes() {
    return ['display-name', ...services.map(([, , , , property]) => property)];
  }
  connectedCallback() { this.render(); }
  disconnectedCallback() { this.observer?.disconnect(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  private render() {
    this.observer?.disconnect();
    const label = escapeHtml(this.getAttribute('display-name')?.trim() || 'ПОСЛУГИ');
    this.innerHTML = `
      <section class="${styles.root}" aria-label="Послуги ROKSI4YK">
        <div class="${styles.inner}">
          <div class="${styles.intro}">
            <p class="${styles.eyebrow}"><span class="${styles.eyebrowLine}" aria-hidden="true"></span>${label}</p>
            <h2 class="${styles.heading}">Краса, <em>яка</em><br>відчувається<br>твоєю.</h2>
            <p class="${styles.lead}">Макіяж, консультації та освіта — щоб підкреслити твій характер, а не приховати його.</p>
          </div>
          <div class="${styles.servicesList}" aria-label="Напрями роботи">
            ${services.map(([number, category, title, meta, property]) => {
              const destination = safeDestination(this.getAttribute(property));
              const tag = destination ? 'a' : 'article';
              const interactionClass = destination ? styles.serviceLink : styles.serviceStatic;
              const linkAttributes = destination
                ? ` href="${escapeHtml(destination)}" aria-label="${escapeHtml(`Послуга ${number}: ${title}. Перейти до сторінки`)}"`
                : '';
              return `
                <${tag} class="${styles.service} ${interactionClass}"${linkAttributes}>
                  <span class="${styles.serviceNumber}" aria-hidden="true">${number}</span>
                  <div class="${styles.serviceMain}">
                    <p class="${styles.serviceSubtitle}">${category}</p>
                    <h3 class="${styles.serviceTitle}">${title}</h3>
                  </div>
                  <p class="${styles.serviceMeta}">${meta}</p>
                  <span class="${styles.serviceArrow}" aria-hidden="true">→</span>
                </${tag}>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
    const root = this.querySelector<HTMLElement>(`.${styles.root}`);
    if (!root) return;
    if (!('IntersectionObserver' in window)) { root.classList.add(styles.visible); return; }
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        root.classList.add(styles.visible);
        this.observer?.disconnect();
      }
    }, { threshold: 0.08 });
    this.observer.observe(root);
  }
}

export default Roksi4ykServices;
