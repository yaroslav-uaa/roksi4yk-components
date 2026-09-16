import React, { type FC, useEffect, useState } from 'react';
import { widget } from '@wix/editor';
import {
  FormField,
  Input,
  SidePanel,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const PORTRAIT_PROPERTY = 'portrait-url';

const Panel: FC = () => {
  const [portraitUrl, setPortraitUrl] = useState('');

  useEffect(() => {
    let active = true;
    void widget.getProp(PORTRAIT_PROPERTY)
      .then(value => {
        if (active) setPortraitUrl(value || '');
      })
      .catch(error => console.error('Failed to fetch portrait-url:', error));
    return () => { active = false; };
  }, []);

  const handlePortraitChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setPortraitUrl(value);
    void widget.setProp(PORTRAIT_PROPERTY, value)
      .catch(error => console.error('Failed to save portrait-url:', error));
  };

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField id="about-portrait-url" label="Portrait image URL">
              <Input
                id="about-portrait-url"
                type="url"
                value={portraitUrl}
                onChange={handlePortraitChange}
                aria-label="Portrait image URL"
              />
            </FormField>
          </SidePanel.Field>
        </SidePanel.Content>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
