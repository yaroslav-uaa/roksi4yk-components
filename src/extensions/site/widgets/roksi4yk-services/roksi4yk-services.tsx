import styles from './roksi4yk-services.module.css';

const services = [
  ['01', 'MAKEUP', 'Макіяж', 'Для особистих образів, подій, зйомок і beauty-проєктів.'],
  ['02', 'CONSULTATIONS', 'Консультації', 'Індивідуальний погляд на косметичку, техніку та образ, що пасує саме тобі.'],
  ['03', 'EDUCATION', 'Навчання', 'Практика макіяжу для тих, хто хоче краще розуміти власну красу.'],
  ['04', 'TEEN BEAUTY', 'Teen beauty', 'Делікатне знайомство з макіяжем і доглядом у власному темпі.'],
  ['05', 'BRAND & CONTENT', 'Бренди та контент', 'Beauty-образи для кампаній, творчих зйомок і візуальних історій.'],
] as const;

function escapeHtml(value: string): string {
  const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, character => entities[character] ?? character);
}

class Roksi4ykServices extends HTMLElement {
  private observer?: IntersectionObserver;

  static get observedAttributes() { return ['display-name']; }
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
            ${services.map(([number, category, title, description]) => `
              <article class="${styles.service}">
                <span class="${styles.serviceNumber}" aria-hidden="true">${number}</span>
                <div class="${styles.serviceMain}">
                  <p class="${styles.serviceSubtitle}">${category}</p>
                  <h3 class="${styles.serviceTitle}">${title}</h3>
                </div>
                <p class="${styles.serviceDescription}">${description}</p>
              </article>
            `).join('')}
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
