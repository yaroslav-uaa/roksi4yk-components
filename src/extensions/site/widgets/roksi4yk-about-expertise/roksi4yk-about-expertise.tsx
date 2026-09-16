import styles from './roksi4yk-about-expertise.module.css';

const PORTRAIT_ALT = 'Портрет Роксолани Пахачук — професійної візажистки та beauty educator';
const URL_PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const UNSAFE_URL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f\\]/;
let instanceCount = 0;

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, character => entities[character] ?? character);
}

function safePortraitUrl(value: string | null): string {
  const candidate = value?.trim();
  if (!candidate || candidate.startsWith('//') || UNSAFE_URL_CHARACTER_PATTERN.test(candidate)) return '';

  try {
    const base = new URL(document.baseURI);
    const parsed = new URL(candidate, base);
    const isRelative = !URL_PROTOCOL_PATTERN.test(candidate);
    if (isRelative && parsed.origin === base.origin) return candidate;
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? candidate : '';
  } catch {
    return '';
  }
}

class Roksi4ykAboutExpertise extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private portraitImage: HTMLImageElement | null = null;
  private imageLoadHandler: EventListener | null = null;
  private imageErrorHandler: EventListener | null = null;
  private readonly titleId: string;

  constructor() {
    super();
    instanceCount += 1;
    this.titleId = `roksi4yk-about-title-${instanceCount}`;
  }

  static get observedAttributes(): string[] {
    return ['portrait-url'];
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.cleanupImageListeners();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private render(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.cleanupImageListeners();

    const portraitUrl = safePortraitUrl(this.getAttribute('portrait-url'));
    const portraitMarkup = portraitUrl
      ? `<img class="${styles.portraitImage}" data-portrait src="${escapeHtml(portraitUrl)}" alt="${PORTRAIT_ALT}" loading="lazy" decoding="async" hidden>`
      : '';

    this.innerHTML = `
      <section class="${styles.root}" aria-labelledby="${this.titleId}">
        <div class="${styles.inner}">
          <header class="${styles.header}">
            <p class="${styles.eyebrow}">
              <span class="${styles.eyebrowLine}" aria-hidden="true"></span>
              ABOUT / EXPERTISE
            </p>
            <h2 class="${styles.heading}" id="${this.titleId}">Макіяж, який<br><em>підкреслює вас</em></h2>
          </header>

          <figure class="${styles.portraitFigure}">
            <div class="${styles.portraitStage}" data-portrait-stage>
              <div class="${styles.portraitPlaceholder}" aria-hidden="true">
                <span class="${styles.placeholderMonogram}">RP</span>
                <span class="${styles.placeholderLabel}">PORTRAIT / ROKSOLANA</span>
              </div>
              ${portraitMarkup}
              <span class="${styles.portraitIndex}" aria-hidden="true">01</span>
            </div>
            <figcaption class="${styles.portraitCaption}">
              <span>Roksolana Pakhachuk</span>
              <span>Professional Makeup Artist · Beauty Educator</span>
            </figcaption>
          </figure>

          <div class="${styles.content}">
            <div class="${styles.intro}">
              <p>Я Роксолана Пахачук — професійний візажист і beauty educator.</p>
              <p>Для мене макіяж — це не спосіб змінити людину. Це інструмент, який допомагає підкреслити характер, риси та індивідуальність.</p>
            </div>

            <blockquote class="${styles.manifesto}">
              <p>Дорогий макіяж —<br>це не багато косметики.</p>
              <p>Це правильна техніка,<br>хороша розтушовка<br>та розуміння особливостей<br>свого обличчя.</p>
            </blockquote>

            <ol class="${styles.credentials}" aria-label="Професійна експертиза Роксолани Пахачук">
              <li class="${styles.credential}">
                <span class="${styles.credentialNumber}" aria-hidden="true">01</span>
                <span class="${styles.credentialCopy}"><strong>OFFICIAL MAKEUP ARTIST</strong><span>Oriflame Home Ukraine</span></span>
              </li>
              <li class="${styles.credential}">
                <span class="${styles.credentialNumber}" aria-hidden="true">02</span>
                <span class="${styles.credentialCopy}"><strong>BEAUTY EDUCATOR</strong><span>Training · Masterclasses</span></span>
              </li>
              <li class="${styles.credential}">
                <span class="${styles.credentialNumber}" aria-hidden="true">03</span>
                <span class="${styles.credentialCopy}"><strong>KYIV &amp; ONLINE</strong><span>Personal Beauty Experience</span></span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    `;

    this.bindPortraitImage();
    const root = this.querySelector<HTMLElement>(`.${styles.root}`);
    if (!root) return;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      root.classList.add(styles.visible);
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      root.classList.add(styles.visible);
      this.observer?.disconnect();
      this.observer = null;
    }, { threshold: 0.08 });
    this.observer.observe(root);
  }

  private bindPortraitImage(): void {
    const image = this.querySelector<HTMLImageElement>('[data-portrait]');
    const stage = this.querySelector<HTMLElement>('[data-portrait-stage]');
    if (!image || !stage) return;

    const showImage = (): void => {
      image.hidden = false;
      stage.classList.add(styles.hasImage);
      this.cleanupImageListeners();
    };
    const showPlaceholder = (): void => {
      image.hidden = true;
      image.removeAttribute('src');
      stage.classList.remove(styles.hasImage);
      this.cleanupImageListeners();
    };

    this.portraitImage = image;
    this.imageLoadHandler = showImage;
    this.imageErrorHandler = showPlaceholder;
    image.addEventListener('load', showImage);
    image.addEventListener('error', showPlaceholder);

    if (image.complete) {
      if (image.naturalWidth > 0) showImage();
      else showPlaceholder();
    }
  }

  private cleanupImageListeners(): void {
    if (this.portraitImage && this.imageLoadHandler) {
      this.portraitImage.removeEventListener('load', this.imageLoadHandler);
    }
    if (this.portraitImage && this.imageErrorHandler) {
      this.portraitImage.removeEventListener('error', this.imageErrorHandler);
    }
    this.portraitImage = null;
    this.imageLoadHandler = null;
    this.imageErrorHandler = null;
  }
}

export default Roksi4ykAboutExpertise;
