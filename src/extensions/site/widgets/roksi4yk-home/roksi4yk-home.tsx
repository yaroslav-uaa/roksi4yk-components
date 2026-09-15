import styles from "./roksi4yk-home.module.css";

const DEFAULT_BOOKING_URL = "/book-online";
const DEFAULT_PORTFOLIO_URL = "/portfolio";
const DEFAULT_IMAGE_ALT = "Роксолана — візажистка та beauty-експертка";
const DEFAULT_IMAGE_SOURCE = new URL(
  "./roksi4yk-portrait-cutout.png",
  import.meta.url,
).href;
const URL_PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const UNSAFE_URL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f\\]/;
let instanceCount = 0;

const getSafeUrl = (
  value: string | null,
  fallback: string,
  baseUrl: string,
  allowedProtocols: ReadonlySet<string>,
): string => {
  const candidate = value?.trim();

  if (
    !candidate ||
    candidate.startsWith("//") ||
    UNSAFE_URL_CHARACTER_PATTERN.test(candidate)
  ) {
    return fallback;
  }

  try {
    const base = new URL(baseUrl);
    const parsed = new URL(candidate, base);
    const isRelative = !URL_PROTOCOL_PATTERN.test(candidate);

    if (isRelative && parsed.origin === base.origin) {
      return candidate;
    }

    return allowedProtocols.has(parsed.protocol) ? candidate : fallback;
  } catch {
    return fallback;
  }
};

const LINK_PROTOCOLS = new Set(["https:", "mailto:", "tel:"]);
const IMAGE_PROTOCOLS = new Set(["https:"]);

class Roksi4ykHomeElement extends HTMLElement {
  private readonly titleId: string;
  private readonly introId: string;

  constructor() {
    super();
    instanceCount += 1;
    this.titleId = `roksi4yk-hero-title-${instanceCount}`;
    this.introId = `roksi4yk-hero-intro-${instanceCount}`;
  }

  static get observedAttributes(): string[] {
    return ["hero-image", "hero-image-alt", "booking-url", "portfolio-url"];
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      this.render();
    }
  }

  private render(): void {
    this.innerHTML = `
      <section class="${styles.root}" aria-labelledby="${this.titleId}">
        <svg width="0" height="0" aria-hidden="true" focusable="false" style="position: absolute">
          <defs>
            <clipPath id="${this.titleId}-portrait-clip" clipPathUnits="objectBoundingBox">
              <path clip-rule="evenodd" transform="scale(0.000651041667 0.0009765625)" d="
                M 903 29
                C 944 28 978 45 1000 68
                C 1020 101 1025 153 1022 213
                C 1021 247 1014 272 996 290
                C 1031 303 1097 319 1122 358
                C 1136 382 1142 414 1146 447
                C 1149 467 1159 491 1160 515
                C 1162 553 1185 584 1189 615
                L 1196 648
                C 1216 664 1242 680 1255 700
                L 1264 731 L 1258 746
                C 1272 761 1274 780 1268 797
                L 1280 810 L 1285 825 L 1302 845
                C 1323 858 1367 876 1388 884
                Q 1396 889 1391 894
                L 1365 891 L 1330 881 L 1307 882
                Q 1297 887 1285 880
                L 1256 871 L 1243 876
                Q 1210 865 1187 872
                L 1158 875 L 1117 884
                C 1111 912 1104 940 1082 949
                C 1044 967 1008 969 976 970
                L 893 966 L 826 967 L 752 968
                Q 728 966 713 945
                L 706 926
                C 650 927 592 920 550 905
                C 528 921 499 925 473 921
                L 430 917 L 423 937
                C 390 960 352 978 314 984
                Q 270 987 245 976
                Q 244 969 254 961
                L 278 941 L 298 922
                Q 316 896 326 862
                L 334 837 L 348 808
                L 348 799 L 339 779
                Q 341 766 351 750
                C 389 685 423 622 450 554
                Q 476 496 520 459
                C 503 446 498 423 499 401
                Q 502 365 522 322
                L 532 302 L 518 311 L 501 313
                L 503 299 L 530 259 L 550 267
                L 559 256 L 573 230
                Q 585 216 614 212
                L 645 198 L 667 191 L 697 179
                Q 715 173 736 179
                L 779 190
                C 779 145 792 98 816 65
                Q 846 32 903 29 Z
                M 424 895 L 433 880 L 450 867
                Q 471 872 486 869
                L 472 904 L 435 909 Z
                M 514 902 L 537 882 L 548 865
                L 549 900 L 534 910 Z
              " />
            </clipPath>
          </defs>
        </svg>
        <div class="${styles.ambient}" aria-hidden="true"></div>

        <div class="${styles.shell}">
          <header class="${styles.masthead}">
            <p class="${styles.wordmark}">ROKSI4YK</p>
            <p class="${styles.discipline}">
              MAKEUP ARTIST <span aria-hidden="true">·</span> BEAUTY EDUCATOR
            </p>
            <p class="${styles.location}">KYIV <span aria-hidden="true">/</span> ONLINE</p>
          </header>

          <div class="${styles.layout}">
            <div class="${styles.art}" aria-hidden="true">
              <span class="${styles.halo}"></span>
              <span class="${styles.orbit}"></span>
            </div>

            <div class="${styles.content}">
              <p class="${styles.overline}">
                <span>Design</span> <span>YOUR BEAUTY</span>
              </p>

              <h1 class="${styles.title}" id="${this.titleId}">
                <span>Макіяж,</span>
                <em>у якому ти</em>
                <span>залишаєшся</span>
                <span>собою.</span>
              </h1>

              <p class="${styles.intro}" id="${this.introId}">
                <span>Персональний макіяж, консультації та освіта —</span>
                <span>щоб підкреслити твій характер, а не приховати його.</span>
              </p>

              <div class="${styles.actions}">
                <a class="${styles.primaryAction}" data-booking-link>
                  ЗАПИСАТИСЯ
                  <span aria-hidden="true">↗</span>
                </a>
                <a class="${styles.secondaryAction}" data-portfolio-link>
                  ДИВИТИСЯ РОБОТИ
                  <svg viewBox="0 0 34 12" aria-hidden="true" focusable="false">
                    <path d="M0 6h31M25 1l6 5-6 5" />
                  </svg>
                </a>
              </div>

              <p class="${styles.availability}">
                Для особливих образів, подій, зйомок і beauty-проєктів
              </p>
            </div>

            <div class="${styles.visual}" style="--portrait-clip: url(#${this.titleId}-portrait-clip)">
              <img
                class="${styles.portrait}"
                data-hero-image
                decoding="async"
                fetchpriority="high"
                loading="eager"
                width="1536"
                height="1024"
                hidden
              />
            </div>

            <div class="${styles.signature}">
              <p class="${styles.signatureName}">Roksolana</p>
              <p class="${styles.signatureSurname}">PAKHACHUK</p>
              <p class="${styles.signatureNote}">
                <span>BEAUTY</span>
                <span>INSPIRATION</span>
                <span>REAL YOU</span>
              </p>
            </div>
          </div>

          <footer class="${styles.expertise}" aria-label="Основні напрями роботи">
            <p>Expertise</p>
            <ul>
              <li><span>01</span> MAKEUP</li>
              <li><span>02</span> CONSULTATIONS</li>
              <li><span>03</span> EDUCATION</li>
              <li><span>04</span> TEEN BEAUTY</li>
              <li><span>05</span> BRAND &amp; CONTENT</li>
            </ul>
          </footer>
        </div>
      </section>
    `;

    this.configureLinks();
    this.configureImage();
  }

  private configureLinks(): void {
    const bookingLink = this.querySelector<HTMLAnchorElement>(
      "[data-booking-link]",
    );
    const portfolioLink = this.querySelector<HTMLAnchorElement>(
      "[data-portfolio-link]",
    );
    const baseUrl = this.ownerDocument.baseURI;

    bookingLink?.setAttribute(
      "href",
      getSafeUrl(
        this.getAttribute("booking-url"),
        DEFAULT_BOOKING_URL,
        baseUrl,
        LINK_PROTOCOLS,
      ),
    );
    portfolioLink?.setAttribute(
      "href",
      getSafeUrl(
        this.getAttribute("portfolio-url"),
        DEFAULT_PORTFOLIO_URL,
        baseUrl,
        LINK_PROTOCOLS,
      ),
    );
  }

  private configureImage(): void {
    const image = this.querySelector<HTMLImageElement>("[data-hero-image]");
    const source = getSafeUrl(
      this.getAttribute("hero-image"),
      DEFAULT_IMAGE_SOURCE,
      this.ownerDocument.baseURI,
      IMAGE_PROTOCOLS,
    );

    if (!image || !source) {
      return;
    }

    image.alt =
      this.getAttribute("hero-image-alt")?.trim() || DEFAULT_IMAGE_ALT;
    let currentSource = source;

    const revealImage = (): void => {
      image.dataset.loaded = "true";
    };

    image.addEventListener("load", revealImage, { once: true });
    image.addEventListener(
      "error",
      () => {
        if (currentSource !== DEFAULT_IMAGE_SOURCE) {
          currentSource = DEFAULT_IMAGE_SOURCE;
          image.removeAttribute("data-loaded");
          image.setAttribute("data-default-portrait", "");
          image.src = currentSource;
          return;
        }

        image.hidden = true;
        image.removeAttribute("src");
      },
    );

    image.toggleAttribute("data-default-portrait", source === DEFAULT_IMAGE_SOURCE);
    image.hidden = false;
    image.src = source;

    if (image.complete && image.naturalWidth > 0) {
      revealImage();
    }
  }
}

export default Roksi4ykHomeElement;
