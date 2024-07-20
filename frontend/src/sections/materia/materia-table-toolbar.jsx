import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import * as XLSX from "xlsx";

// ----------------------------------------------------------------------

export function MateriaTableToolbar({ data, filters, options,  onResetPage }) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterGrados = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ grados: newValue });
    },
    [filters, onResetPage]
  );

  const DownloadReport = () => {
    popover.onClose()

    const rows = data.map((materia) => ({
      id: materia.id,
      nombre: materia.name,
      grado: materia.grado,
      clase: materia.clase,
      docent: `${materia.docente_nombres} ${materia.docente_apellidos}`,
      created_at: materia.created_at,
    }));
    //console.log(rows)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "main");    
    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["ID", "Nombre", "Grado", "Clase", "Docente", "Created_at" ],
    ]);
    const cells_width = []
    for (const [key, value] of Object.entries(rows[0])) {
      cells_width.push({"wch": 20});
    }
    worksheet["!cols"] = cells_width;
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"};
    const rptname = "Materias_" + new Date().toLocaleDateString(undefined, options) + ".xlsx"
    XLSX.writeFile(workbook, rptname, { compression: true });
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Grados</InputLabel>

          <Select
            multiple
            value={filters.state.grados}
            onChange={handleFilterGrados}
            input={<OutlinedInput label="Grados" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options.grados.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.grados.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Buscar por nombre..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuList>
            <MenuItem
              onClick={DownloadReport}
            >
              <Iconify icon="solar:export-bold" />
              Export
            </MenuItem>
          </MenuList>
        </MenuList>
      </CustomPopover>
    </>
  );
}
