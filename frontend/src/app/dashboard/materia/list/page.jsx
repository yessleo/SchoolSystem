import { CONFIG } from 'src/config-global';

import { MateriaListView } from 'src/sections/materia/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Materias list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <MateriaListView />;
}
