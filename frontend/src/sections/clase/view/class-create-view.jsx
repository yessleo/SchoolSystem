'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClaseNewForm } from '../class-new-form';

import { ClassToolbar } from '../class-toolbar';

// ----------------------------------------------------------------------

export function ClaseCreateView() {
  return (
    <DashboardContent>
      <ClassToolbar
        backLink={paths.dashboard.clase.list}
      />
      <CustomBreadcrumbs
        heading="Crear nueva clase"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Clase', href: paths.dashboard.clase.root },
          { name: 'Nueva clase' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ClaseNewForm />
    </DashboardContent>
  );
}
