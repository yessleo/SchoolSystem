import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { NotasListView } from 'src/sections/materia/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Notas | Dashboard - ${CONFIG.site.name}` };

export default function Page({ params }) {
  const {id } = params;

  return <NotasListView materia = {id} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _userList.map((user) => ({ id: user.id }));
  }
  return [];
}
