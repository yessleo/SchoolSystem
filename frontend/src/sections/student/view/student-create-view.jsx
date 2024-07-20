'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StudentNewEditForm } from '../student-new-edit-form';

import { StudentToolbar } from '../student-toolbar';

// ----------------------------------------------------------------------

export function StudentCreateView() {
  return (
    <DashboardContent>
      <StudentToolbar
        backLink={paths.dashboard.student.list}
      />
      <CustomBreadcrumbs
        heading="Crear nuevo estudiantes"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Estudiantes', href: paths.dashboard.student.root },
          { name: 'Nuevo estudiante' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StudentNewEditForm />
    </DashboardContent>
  );
}
