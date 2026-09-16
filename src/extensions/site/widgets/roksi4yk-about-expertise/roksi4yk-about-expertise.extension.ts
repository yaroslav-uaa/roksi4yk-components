import { extensions } from '@wix/astro/builders'

export default extensions.customElement({
  id: '171ef5a1-8578-44f8-880b-16bcd04ab4eb',
  name: 'ROKSI4YK About Expertise',
  width: {
    defaultWidth: 1440,
    allowStretch: true
  },
  height: {
    defaultHeight: 1600
  },
  installation: {
    autoAdd: false
  },
  presets: [
    {
      id: 'e9b70780-7161-4aa0-b425-528773db24c0',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/roksi4yk-about-expertise-thumbnail.png',
    },
  ],
  
  tagName: 'roksi4yk-about-expertise',
  element: './extensions/site/widgets/roksi4yk-about-expertise/roksi4yk-about-expertise.tsx',
  settings: './extensions/site/widgets/roksi4yk-about-expertise/roksi4yk-about-expertise.panel.tsx',
});
