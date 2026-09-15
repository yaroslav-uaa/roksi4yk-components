import React, { type FC, useEffect, useState } from 'react';
import { widget } from '@wix/editor';
import { FormField, Input, SidePanel, WixDesignSystemProvider } from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const imageKeys = ['01', '02', '03', '04', '05', '06'] as const;
type ImageKey = typeof imageKeys[number];
type Images = Record<ImageKey, string>;

const emptyImages: Images = {
  '01': '', '02': '', '03': '', '04': '', '05': '', '06': '',
};

const Panel: FC = () => {
  const [images, setImages] = useState<Images>(emptyImages);

  useEffect(() => {
    let active = true;
    Promise.all(imageKeys.map(async key => ({
      key,
      value: await widget.getProp(`image-${key}`),
    })))
      .then(results => {
        if (!active) return;
        setImages(results.reduce<Images>(
          (next, { key, value }) => ({ ...next, [key]: value || '' }),
          emptyImages,
        ));
      })
      .catch(error => console.error('Failed to load Selected Works images:', error));
    return () => { active = false; };
  }, []);

  const updateImage = (key: ImageKey, value: string) => {
    setImages(previous => ({ ...previous, [key]: value }));
    void widget.setProp(`image-${key}`, value)
      .catch(error => console.error(`Failed to save Selected Works image ${key}:`, error));
  };

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          {imageKeys.map(key => (
            <SidePanel.Field key={key}>
              <FormField label={`Image ${key} URL`}>
                <Input
                  type="url"
                  value={images[key]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateImage(key, event.target.value)}
                  placeholder="Paste a Wix Media image URL"
                  aria-label={`Image ${key} URL`}
                />
              </FormField>
            </SidePanel.Field>
          ))}
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
