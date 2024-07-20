import { CONFIG } from 'src/config-global';

import { StudentListView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Students list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <StudentListView />;
}
