import { extensions } from '@wix/astro/builders'

export default extensions.customElement({
  id: '6a711017-6a63-46be-bd46-b6a5b52fc0f2',
  name: 'ROKSI4YK Services',
  width: {
    defaultWidth: 1440,
    allowStretch: true
  },
  height: {
    defaultHeight: 1100
  },
  installation: {
    autoAdd: false,
  },
  presets: [
    {
      id: 'c0bcc851-ddd4-45a4-9f2c-dc12e54e1d02',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/roksi4yk-services-thumbnail.png',
    },
  ],
  
  tagName: 'roksi4yk-services',
  element: './extensions/site/widgets/roksi4yk-services/roksi4yk-services.tsx',
  settings: './extensions/site/widgets/roksi4yk-services/roksi4yk-services.panel.tsx',
});
