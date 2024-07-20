'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StudentNewEditForm } from '../student-new-edit-form';
import { StudentToolbar } from '../student-toolbar';

import {getUser } from 'src/actions/student';

import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------
export function StudentEditView({ student: currentStudent }) {
  const [StudentData, setStudentData] = useState(null);
  useEffect(() => {
    getUser(currentStudent).then(result => setStudentData(result.data));
  }, []);
  return (
    <DashboardContent>
      <StudentToolbar
        backLink={paths.dashboard.student.list}
      />
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Estudiante', href: paths.dashboard.student.root },
          { name: StudentData?.nombres },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StudentNewEditForm currentStudent={StudentData} />
    </DashboardContent>
  );
}
