import { CONFIG } from 'src/config-global';

import { ClaseCreateView } from 'src/sections/clase/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ClaseCreateView />;
}
