import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellS_parcial({ params }) {
  return params.row.s_parcial;
}

export function RenderCellP_parcial({ params }) {
  return params.row.p_parcial;
}

export function RenderCellPrimerSem({ params }) {
  return params.row.final_primer_semestre;
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function RenderCellStudent({ params, onViewRow }) {
  return (
    <Stack direction="row" sx={{ py: 2, width: 1 }}>
      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.student_nombres} {params.row.student_apellidos}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
