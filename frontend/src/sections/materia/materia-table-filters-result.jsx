import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function MateriaTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveGrados = useCallback(
    (inputValue) => {
      const newValue = filters.state.grados.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ grados: newValue });
    },
    [filters, onResetPage]
  );


  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Grados:" isShow={!!filters.state.grados.length}>
        {filters.state.grados.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveGrados(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
