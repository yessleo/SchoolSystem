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

import * as XLSX from "xlsx";

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function DocentTableToolbar({data, filters, onResetPage }) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ nombres: event.target.value });
    },
    [filters, onResetPage]
  );
  const DownloadDocents = () => {
    popover.onClose()

    const rows = data.map((docent) => ({
      id: docent.id,
      nombres: docent.nombres,
      apellidos: docent.apellidos,
      fecha_nac: docent.fecha_nac,
      created_at: docent.created_at,
    }));
    //console.log(rows)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "main");    
    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["ID", "Nombres", "Apellidos", "Fecha Nacimiento", "Created_at" ],
    ]);
    const cells_width = []
    for (const [key, value] of Object.entries(rows[0])) {
      cells_width.push({"wch": 20});
    }
    worksheet["!cols"] = cells_width;
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"};
    const rptname = "Docentes_Summary_" + new Date().toLocaleDateString(undefined, options) + ".xlsx"
    XLSX.writeFile(workbook, rptname, { compression: true });
  };

  const DownloadDetails = () => {
    popover.onClose()

    const rows = data.map((docent) => ({
      id: docent.id,
      nombres: docent.nombres,
      apellidos: docent.apellidos,
      fecha_nac: docent.fecha_nac,
      user: docent.user.id,
      genero: docent.genero,
      direccion: docent.direccion,
      contacto: docent.contacto,
      created_at: docent.created_at,
    }));
    //console.log(rows)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "main");    
    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["ID", "Nombres", "Apellidos", "Fecha Nacimiento", "User_id", "Genero", "Direccion", "Contacto", "Created_at" ],
    ]);
    const cells_width = []
    for (const [key, value] of Object.entries(rows[0])) {
      cells_width.push({"wch": 20});
    }
    worksheet["!cols"] = cells_width;
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit"};
    const rptname = "Docente_Detalle_" + new Date().toLocaleDateString(undefined, options) + ".xlsx"
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

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.nombres}
            onChange={handleFilterName}
            placeholder="Search..."
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
          <MenuItem
            onClick={DownloadDocents}
          >
            <Iconify icon="solar:export-bold" />
            Export Summary
          </MenuItem>
          <MenuItem
            onClick={DownloadDetails}
          >
            <Iconify icon="solar:export-bold" />
            Export Detalles
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
