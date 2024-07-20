'use client';

import {  useState, useEffect, useCallback  } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  _jobs,
  _roles,
  CLASS_SORT_OPTIONS,
} from 'src/_mock';

import { useGetClases } from 'src/actions/clases';
import { getGrados } from 'src/actions/clases';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClassList } from '../class-list';
import { ClassSort } from '../class-sort';
import { ClassFilters } from '../class-filters';
import { ClassFiltersResult } from '../class-filters-result';

// ----------------------------------------------------------------------

export function ClassListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('reciente');

  const filters = useSetState({
    grados: [],
  });

  const [_clases, setClasesData] = useState([]);
  useEffect(() => {
    useGetClases().then(result => setClasesData(result.data));
  }, []);


  const [_grados, setGradostData] = useState([]);
  useEffect(() => {
    getGrados().then(result => setGradostData(result.data));
  }, []);

  const dataFiltered = applyFilter({ inputData: _clases, filters: filters.state, sortBy });

  const canReset =
    filters.state.grados.length > 0 ;

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);


  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <Stack direction="row" spacing={1} flexShrink={0}>
        <ClassFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            grados: _grados,
          }}
        />

        <ClassSort sort={sortBy} onSort={handleSortBy} sortOptions={CLASS_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = <ClassFiltersResult filters={filters} totalResults={dataFiltered.length} />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Clases', href: paths.dashboard.clase.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.clase.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nueva clase
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ClassList clases={dataFiltered} />
    </DashboardContent>
  );
}

const applyFilter = ({ inputData, filters, sortBy }) => {
  const { grados } = filters;

  console.log(grados)

  // Sort by
  if (sortBy === 'reciente') {
    inputData = orderBy(inputData, ['created_at'], ['desc']);
  }

  if (sortBy === 'antiguo') {
    inputData = orderBy(inputData, ['created_at'], ['asc']);
  }


  // Filters
  if (grados.length) {
    inputData = inputData.filter((clase) => grados.includes(clase.id_grado));
  }


  return inputData;
};
