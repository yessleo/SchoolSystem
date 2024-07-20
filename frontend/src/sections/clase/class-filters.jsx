import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CountrySelect } from 'src/components/country-select';

// ----------------------------------------------------------------------

export function ClassFilters({ open, canReset, onOpen, onClose, filters, options }) {
  // const handleFilterEmploymentTypes = useCallback(
  //   (newValue) => {
  //     const checked = filters.state.employmentTypes.includes(newValue)
  //       ? filters.state.employmentTypes.filter((value) => value !== newValue)
  //       : [...filters.state.employmentTypes, newValue];

  //     filters.setState({ employmentTypes: checked });
  //   },
  //   [filters]
  // );

  // const handleFilterExperience = useCallback(
  //   (newValue) => {
  //     filters.setState({ experience: newValue });
  //   },
  //   [filters]
  // );

  const handleFilterGrados = useCallback(
    (newValue) => {
      filters.setState({ grados: newValue });
    },
    [filters]
  );

  // const handleFilterLocations = useCallback(
  //   (newValue) => {
  //     filters.setState({ locations: newValue });
  //   },
  //   [filters]
  // );

  // const handleFilterBenefits = useCallback(
  //   (newValue) => {
  //     const checked = filters.state.benefits.includes(newValue)
  //       ? filters.state.benefits.filter((value) => value !== newValue)
  //       : [...filters.state.benefits, newValue];

  //     filters.setState({ benefits: checked });
  //   },
  //   [filters]
  // );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  // const renderEmploymentTypes = (
  //   <Box display="flex" flexDirection="column">
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       Employment types
  //     </Typography>
  //     {options.employmentTypes.map((option) => (
  //       <FormControlLabel
  //         key={option}
  //         control={
  //           <Checkbox
  //             checked={filters.state.employmentTypes.includes(option)}
  //             onClick={() => handleFilterEmploymentTypes(option)}
  //           />
  //         }
  //         label={option}
  //       />
  //     ))}
  //   </Box>
  // );

  // const renderExperience = (
  //   <Box display="flex" flexDirection="column">
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       Experience
  //     </Typography>
  //     {options.experiences.map((option) => (
  //       <FormControlLabel
  //         key={option}
  //         control={
  //           <Radio
  //             checked={option === filters.state.experience}
  //             onClick={() => handleFilterExperience(option)}
  //           />
  //         }
  //         label={option}
  //         sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
  //       />
  //     ))}
  //   </Box>
  // );

  const renderGrados = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Grados
      </Typography>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options.grados.map((option) => option)}
        getOptionLabel={(option) => option.nombre}
        value={filters.state.grados}
        onChange={(event, newValue) => handleFilterGrados(newValue)}
        renderInput={(params) => <TextField placeholder="Seleccione Grados" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.nombre}
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </Box>
  );

  // const renderLocations = (
  //   <Box display="flex" flexDirection="column">
  //     <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
  //       Locations
  //     </Typography>

  //     <CountrySelect
  //       id="multiple-locations"
  //       multiple
  //       fullWidth
  //       placeholder={filters.state.locations.length ? '+ Locations' : 'Select Locations'}
  //       value={filters.state.locations}
  //       onChange={(event, newValue) => handleFilterLocations(newValue)}
  //     />
  //   </Box>
  // );

  // const renderBenefits = (
  //   <Box display="flex" flexDirection="column">
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       Benefits
  //     </Typography>
  //     {options.benefits.map((option) => (
  //       <FormControlLabel
  //         key={option}
  //         control={
  //           <Checkbox
  //             checked={filters.state.benefits.includes(option)}
  //             onClick={() => handleFilterBenefits(option)}
  //           />
  //         }
  //         label={option}
  //       />
  //     ))}
  //   </Box>
  // );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        {renderHead}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderGrados}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
