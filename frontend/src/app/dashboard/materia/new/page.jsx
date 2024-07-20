import { CONFIG } from 'src/config-global';

import { MateriaCreateView } from 'src/sections/materia/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <MateriaCreateView />;
}
