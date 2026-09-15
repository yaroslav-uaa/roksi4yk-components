import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import roksi4YkHome from './extensions/site/widgets/roksi4yk-home/roksi4yk-home.extension.ts';

export default app()
  .use(myPage).use(roksi4YkHome);
