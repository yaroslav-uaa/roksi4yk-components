import styles from './roksi4yk-selected-works.module.css';

const works = [
  { number: '01', label: 'BEAUTY / 01' },
  { number: '02', label: 'BEAUTY / 02' },
  { number: '03', label: 'BEAUTY / 03' },
  { number: '04', label: 'BEAUTY / 04' },
  { number: '05', label: 'BEAUTY / 05' },
  { number: '06', label: 'BEAUTY / 06' },
] as const;

const imageAttributes = works.flatMap(({ number }) => [
  `image-${number}`,
  `image-${number}-srcset`,
]);

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, character => entities[character] ?? character);
}

function browserImageUrl(value: string | null): string {
  const candidate = value?.trim();
  if (!candidate) return '';
  try {
    const url = new URL(candidate, document.baseURI);
    return url.protocol === 'https:' || url.protocol === 'http:' ? candidate : '';
  } catch {
    return '';
  }
}

class Roksi4ykSelectedWorks extends HTMLElement {
  private observer?: IntersectionObserver;

  static get observedAttributes() {
    return imageAttributes;
  }

  connectedCallback() { this.render(); }
  disconnectedCallback() { this.observer?.disconnect(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  private render() {
    this.observer?.disconnect();
    this.innerHTML = `
      <section class="${styles.root}" aria-label="ROKSI4YK Selected Works">
        <div class="${styles.inner}">
          <header class="${styles.header}">
            <div>
              <p class="${styles.eyebrow}">SELECTED WORKS</p>
              <h2 class="${styles.heading}">Мої <em>роботи</em></h2>
            </div>
            <p class="${styles.supporting}">Beauty, character,<br>individuality.</p>
          </header>
          <div class="${styles.grid}">
            ${works.map(({ number, label }) => {
              const src = browserImageUrl(this.getAttribute(`image-${number}`));
              const srcSet = this.getAttribute(`image-${number}-srcset`)?.trim() || '';
              const sizes = number === '01' || number === '05'
                ? '(max-width: 700px) 100vw, 55vw'
                : number === '04'
                  ? '(max-width: 700px) 90vw, 45vw'
                  : '(max-width: 700px) 85vw, 32vw';
              return `
                <figure class="${styles.work}">
                  <div class="${styles.frame} ${src ? '' : styles.empty}">
                    ${src
                      ? `<img class="${styles.image}" src="${escapeHtml(src)}" ${srcSet ? `srcset="${escapeHtml(srcSet)}" sizes="${sizes}"` : ''} alt="Вибрана робота ROKSI4YK ${number}" loading="lazy" decoding="async">`
                      : `<span class="${styles.emptyMark}" aria-hidden="true">${number}</span>`}
                    <span class="${styles.hoverLabel}" aria-hidden="true">${label} <span>↗</span></span>
                  </div>
                  <figcaption class="${styles.caption}">
                    <span>${number} / SELECTED WORK</span>
                    <span>ROKSI4YK</span>
                  </figcaption>
                </figure>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;

    const root = this.querySelector<HTMLElement>(`.${styles.root}`);
    if (!root) return;
    const figures = root.querySelectorAll<HTMLElement>(`.${styles.work}`);
    if (!('IntersectionObserver' in window)) {
      root.classList.add(styles.visible);
      figures.forEach(figure => figure.classList.add(styles.revealed));
      return;
    }
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        target.classList.add(target === root ? styles.visible : styles.revealed);
        this.observer?.unobserve(target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    this.observer.observe(root);
    figures.forEach(figure => this.observer?.observe(figure));
  }
}

export default Roksi4ykSelectedWorks;
