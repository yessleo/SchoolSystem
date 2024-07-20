import { CONFIG } from 'src/config-global';

import { DocentCreateView } from 'src/sections/docent/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new docent | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <DocentCreateView />;
}
