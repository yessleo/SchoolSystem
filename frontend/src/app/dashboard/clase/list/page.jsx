import { CONFIG } from 'src/config-global';

import { ClassListView } from 'src/sections/clase/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Classes list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ClassListView />;
}
