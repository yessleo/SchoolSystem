'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DocentNewEditForm } from '../docent-new-edit-form';

import { DocentToolbar } from '../docent-toolbar';

// ----------------------------------------------------------------------

export function DocentCreateView() {
  return (
    <DashboardContent>
      <DocentToolbar
        backLink={paths.dashboard.docent.list}
      />
      <CustomBreadcrumbs
        heading="Crear nuevo docente"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Docentes', href: paths.dashboard.docent.root },
          { name: 'Nuevo Docente' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocentNewEditForm />
    </DashboardContent>
  );
}
