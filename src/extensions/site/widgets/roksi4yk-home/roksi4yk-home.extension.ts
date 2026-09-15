import { extensions } from "@wix/astro/builders";

export default extensions.customElement({
  id: "6f9c959d-b886-4b6d-8e17-8eff7b58e2ca",
  name: "ROKSI4YK Hero",
  width: {
    defaultWidth: 1200,
    allowStretch: true,
  },
  height: {
    defaultHeight: 720,
  },
  installation: {
    autoAdd: true,
  },
  presets: [
    {
      id: "a0df007b-4ec4-409a-91ca-82558ea39c0d",
      name: "default",
      thumbnailUrl: "{{BASE_URL}}/roksi4yk-home-thumbnail.png",
    },
  ],
  tagName: "roksi4yk-home",
  element: "./extensions/site/widgets/roksi4yk-home/roksi4yk-home.tsx",
  settings: "./extensions/site/widgets/roksi4yk-home/roksi4yk-home.panel.tsx",
});
