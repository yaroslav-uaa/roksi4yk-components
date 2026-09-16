import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import roksi4YkHome from './extensions/site/widgets/roksi4yk-home/roksi4yk-home.extension.ts';
import roksi4YkServices from './extensions/site/widgets/roksi4yk-services/roksi4yk-services.extension.ts';
import roksi4YkSelectedWorks from './extensions/site/widgets/roksi4yk-selected-works/roksi4yk-selected-works.extension.ts';

import roksi4YkAboutExpertise from './extensions/site/widgets/roksi4yk-about-expertise/roksi4yk-about-expertise.extension.ts';

export default app()
  .use(myPage).use(roksi4YkHome).use(roksi4YkServices).use(roksi4YkSelectedWorks).use(roksi4YkAboutExpertise);

