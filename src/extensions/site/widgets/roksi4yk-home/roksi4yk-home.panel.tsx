import React, {
  type FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { widget } from "@wix/editor";
import {
  FormField,
  Input,
  SidePanel,
  WixDesignSystemProvider,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";

interface HeroSettings {
  heroImage: string;
  heroImageAlt: string;
  bookingUrl: string;
  portfolioUrl: string;
}

const DEFAULT_SETTINGS: HeroSettings = {
  heroImage: "",
  heroImageAlt: "Роксолана — візажистка та beauty-експертка",
  bookingUrl: "/book-online",
  portfolioUrl: "/portfolio",
};

const Panel: FC = () => {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_SETTINGS);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async (): Promise<void> => {
      try {
        const [heroImage, heroImageAlt, bookingUrl, portfolioUrl] =
          await Promise.all([
            widget.getProp("hero-image"),
            widget.getProp("hero-image-alt"),
            widget.getProp("booking-url"),
            widget.getProp("portfolio-url"),
          ]);

        if (isMounted) {
          setSettings({
            heroImage: heroImage || DEFAULT_SETTINGS.heroImage,
            heroImageAlt: heroImageAlt || DEFAULT_SETTINGS.heroImageAlt,
            bookingUrl: bookingUrl || DEFAULT_SETTINGS.bookingUrl,
            portfolioUrl: portfolioUrl || DEFAULT_SETTINGS.portfolioUrl,
          });
        }
      } catch (error) {
        console.error("Failed to load ROKSI4YK hero settings:", error);
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateLocalSetting = useCallback(
    (key: keyof HeroSettings, value: string): void => {
      setSettings((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const persistSetting = useCallback(
    (propName: string, value: string): void => {
      writeQueue.current = writeQueue.current
        .then(() => widget.setProp(propName, value))
        .catch((error) =>
          console.error(`Failed to update ${propName}:`, error),
        );
    },
    [],
  );

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300px" height="100vh">
        <SidePanel.Header title="ROKSI4YK Hero" />
        <SidePanel.Content noPadding>
          <SidePanel.Section title="Портрет">
            <SidePanel.Field>
              <FormField
                id="hero-image"
                label="URL зображення"
                infoContent="Використайте пряме HTTPS-посилання на вертикальний портрет. Без зображення відображається фірмова арт-композиція."
              >
                <Input
                  id="hero-image"
                  size="small"
                  type="url"
                  value={settings.heroImage}
                  placeholder="https://..."
                  onChange={(event) =>
                    updateLocalSetting("heroImage", event.target.value)
                  }
                  onBlur={(event) =>
                    persistSetting("hero-image", event.target.value)
                  }
                />
              </FormField>
            </SidePanel.Field>

            <SidePanel.Field>
              <FormField
                id="hero-image-alt"
                label="Опис зображення"
                infoContent="Коротко опишіть портрет для відвідувачів, які користуються скринрідером."
              >
                <Input
                  id="hero-image-alt"
                  size="small"
                  type="text"
                  value={settings.heroImageAlt}
                  onChange={(event) =>
                    updateLocalSetting("heroImageAlt", event.target.value)
                  }
                  onBlur={(event) =>
                    persistSetting("hero-image-alt", event.target.value)
                  }
                />
              </FormField>
            </SidePanel.Field>
          </SidePanel.Section>

          <SidePanel.Section title="Посилання">
            <SidePanel.Field>
              <FormField
                id="booking-url"
                label="Кнопка «Записатися»"
                infoContent="Вкажіть шлях сторінки Wix, наприклад /book-online, або повне HTTPS-посилання."
              >
                <Input
                  id="booking-url"
                  size="small"
                  type="text"
                  value={settings.bookingUrl}
                  onChange={(event) =>
                    updateLocalSetting("bookingUrl", event.target.value)
                  }
                  onBlur={(event) =>
                    persistSetting("booking-url", event.target.value)
                  }
                />
              </FormField>
            </SidePanel.Field>

            <SidePanel.Field>
              <FormField
                id="portfolio-url"
                label="Кнопка «Дивитися роботи»"
                infoContent="Вкажіть шлях сторінки Wix, наприклад /portfolio, або повне HTTPS-посилання."
              >
                <Input
                  id="portfolio-url"
                  size="small"
                  type="text"
                  value={settings.portfolioUrl}
                  onChange={(event) =>
                    updateLocalSetting("portfolioUrl", event.target.value)
                  }
                  onBlur={(event) =>
                    persistSetting("portfolio-url", event.target.value)
                  }
                />
              </FormField>
            </SidePanel.Field>
          </SidePanel.Section>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
