'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MateriaNewForm } from '../materia-new-edit-form';


// ----------------------------------------------------------------------

export function MateriaCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Crear nueva materia"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Materia', href: paths.dashboard.materia.root },
          { name: 'Nueva materia' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MateriaNewForm />
    </DashboardContent>
  );
}
