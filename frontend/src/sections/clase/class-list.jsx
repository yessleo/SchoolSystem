import { useCallback } from 'react';
import { toast } from 'src/components/snackbar';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { ClassItem } from './class-item';

import { deleteClase } from 'src/actions/clases';

// ----------------------------------------------------------------------

export function ClassList({ clases }) {
  const router = useRouter();

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.clase.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.clase.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback(async (id) => {
    await deleteClase(id)
    router.push(paths.dashboard.clase.list);
    router.refresh();
    toast.success('Clase eliminada!');
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {clases.map((clase) => (
          <ClassItem
            key={clase.id}
            clase={clase}
            onView={() => handleView(clase.id)}
            onEdit={() => handleEdit(clase.id)}
            onDelete={() => handleDelete(clase.id)}
          />
        ))}
      </Box>

      {clases.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
