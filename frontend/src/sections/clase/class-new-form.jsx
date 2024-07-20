import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import copy from "copy-to-clipboard";

import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createClase, getGrados } from 'src/actions/clases';

import { fData } from 'src/utils/format-number';


import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const NewClaseSchema = zod.object({
  nombre: zod.string().min(1, { message: 'Nombre es requerido!' }),
  grado: zod.number(),
  periodo_escolar: zod.number(),

});

// ----------------------------------------------------------------------

export function ClaseNewForm({ currentClase }) {
  const router = useRouter();


  const defaultValues = useMemo(
    () => ({
      nombre: currentClase?.nombre || '',
      grado: currentClase?.grado || '',
      periodo_escolar: currentClase?.periodo_escolar || new Date().getFullYear(),
    }),
    [currentClase]
  );



  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewClaseSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data)
      await createClase({nombre:data.nombre, grado: data.grado, periodo_escolar:data.periodo_escolar});
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Creación exitosa!');
      router.push(paths.dashboard.clase.list);
      router.refresh();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  const [GradosData, setGradostData] = useState([]);
  useEffect(() => {
    getGrados().then(result => setGradostData(result.data));
  }, []);


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Datos:
          </Typography>
          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
          <Stack  spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Field.Text
                name= "nombre"
                label="Nombre"
                InputLabelProps={{ shrink: true }}
              />
  
              <Box sx={{ m: 1, minWidth: 200 }}>
                <Field.Text name="periodo_escolar" label="Periodo electivo" />
              </Box>
              
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <Field.Select
                  name= "grado"
                  label="Grados"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>
                  {GradosData.map((grado) => (
                    <MenuItem
                      key={grado.id}
                      value={grado.id}
                    >
                      {grado.nombre}
                    </MenuItem>
                  ))}

                </Field.Select>
              </FormControl>
            </Stack>

          </Stack>
        </Box>

      </Card>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={isSubmitting}
        >
          Crear
        </LoadingButton>
      </Stack>
    </Form>
  );
}
