import { extensions } from '@wix/astro/builders'

export default extensions.customElement({
  id: 'a5db6e94-5c78-4fcf-8b8f-e55f00544f05',
  name: 'ROKSI4YK Selected Works',
  width: {
    defaultWidth: 1440,
    allowStretch: true
  },
  height: {
    defaultHeight: 3000
  },
  installation: {
    autoAdd: false
  },
  presets: [
    {
      id: '6e265b1c-3658-4bba-8ef4-c448c086ce8d',
      name: 'default',
      thumbnailUrl: '{{BASE_URL}}/roksi4yk-selected-works-thumbnail.png',
    },
  ],

  tagName: 'roksi4yk-selected-works',
  element: './extensions/site/widgets/roksi4yk-selected-works/roksi4yk-selected-works.tsx',
  settings: './extensions/site/widgets/roksi4yk-selected-works/roksi4yk-selected-works.panel.tsx',
});
