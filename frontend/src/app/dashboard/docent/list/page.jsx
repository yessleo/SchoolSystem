import { CONFIG } from 'src/config-global';

import { DocentListView } from 'src/sections/docent/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Docents list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <DocentListView />;
}
