'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DocentNewEditForm } from '../docent-new-edit-form';
import { DocentToolbar } from '../docent-toolbar';


import {getUser } from 'src/actions/users';

import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
export function DocentEditView({ docent: currentDocent }) {
  const [DocentData, setDocentData] = useState(null);
  useEffect(() => {
    getUser(currentDocent).then(result => setDocentData(result.data));
  }, []);
  return (
    <DashboardContent>
      <DocentToolbar
        backLink={paths.dashboard.docent.list}
      />
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Docente', href: paths.dashboard.docent.root },
          { name: DocentData?.nombres },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocentNewEditForm currentDocent={DocentData} />
    </DashboardContent>
  );
}
