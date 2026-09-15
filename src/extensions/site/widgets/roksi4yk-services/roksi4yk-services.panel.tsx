import React, { type FC, useState, useEffect } from 'react';
import { widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  FormField,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

const destinationFields = [
  { property: 'makeup-url', label: '01 MAKEUP URL' },
  { property: 'consultations-url', label: '02 CONSULTATIONS URL' },
  { property: 'education-url', label: '03 EDUCATION URL' },
  { property: 'teen-beauty-url', label: '04 TEEN BEAUTY URL' },
  { property: 'brand-content-url', label: '05 BRAND & CONTENT URL' },
] as const;

type DestinationProperty = (typeof destinationFields)[number]['property'];

const emptyDestinations: Record<DestinationProperty, string> = {
  'makeup-url': '',
  'consultations-url': '',
  'education-url': '',
  'teen-beauty-url': '',
  'brand-content-url': '',
};

const Panel: FC = () => {
  const [displayName, setDisplayName] = useState<string>('ПОСЛУГИ');
  const [destinations, setDestinations] = useState<Record<DestinationProperty, string>>(emptyDestinations);

  useEffect(() => {
    let active = true;
    void widget.getProp('display-name')
      .then(value => { if (active) setDisplayName(value || 'ПОСЛУГИ'); })
      .catch(error => console.error('Failed to fetch display-name:', error));
    for (const { property } of destinationFields) {
      void widget.getProp(property)
        .then(value => {
          if (active) setDestinations(current => ({ ...current, [property]: value || '' }));
        })
        .catch(error => console.error(`Failed to fetch ${property}:`, error));
    }
    return () => { active = false; };
  }, []);

  const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayName = event.target.value;
    setDisplayName(newDisplayName);
    void widget.setProp('display-name', newDisplayName)
      .catch(error => console.error('Failed to save display-name:', error));
  };

  const handleDestinationChange = (property: DestinationProperty, value: string) => {
    setDestinations(current => ({ ...current, [property]: value }));
    void widget.setProp(property, value)
      .catch(error => console.error(`Failed to save ${property}:`, error));
  };

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField id="services-display-name" label="Section label">
              <Input
                id="services-display-name"
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                aria-label="Section label"
              />
            </FormField>
          </SidePanel.Field>
          {destinationFields.map(({ property, label }) => (
            <SidePanel.Field key={property}>
              <FormField id={property} label={label}>
                <Input
                  id={property}
                  type="url"
                  value={destinations[property]}
                  onChange={event => handleDestinationChange(property, event.target.value)}
                  aria-label={label}
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
