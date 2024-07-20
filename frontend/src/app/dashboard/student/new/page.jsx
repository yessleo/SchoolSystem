import { CONFIG } from 'src/config-global';

import { StudentCreateView } from 'src/sections/student/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <StudentCreateView />;
}
