import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function ClassFiltersResult({ filters, totalResults, sx }) {
  // const handleRemoveEmploymentTypes = (inputValue) => {
  //   const newValue = filters.state.employmentTypes.filter((item) => item !== inputValue);
  //   filters.setState({ employmentTypes: newValue });
  // };

  // const handleRemoveExperience = () => {
  //   filters.setState({ experience: 'all' });
  // };

  const handleRemoveGrados = (inputValue) => {
    const newValue = filters.state.grados.filter((item) => item !== inputValue);
    filters.setState({ grados: newValue });
  };

  // const handleRemoveLocations = (inputValue) => {
  //   const newValue = filters.state.locations.filter((item) => item !== inputValue);
  //   filters.setState({ locations: newValue });
  // };

  // const handleRemoveBenefits = (inputValue) => {
  //   const newValue = filters.state.benefits.filter((item) => item !== inputValue);
  //   filters.setState({ benefits: newValue });
  // };

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Grados:" isShow={!!filters.state.grados.length}>
        {filters.state.grados.map((item) => (
          <Chip {...chipProps} key={item.id} label={item.nombre} onDelete={() => handleRemoveGrados(item.id)} />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
