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

import { USER_STATUS_OPTIONS, USER_ROLES_OPTIONS } from 'src/_mock';
import { getClasesbyGrado, getGrados, getclase } from 'src/actions/clases';
import { useGetDocents } from 'src/actions/docent';
import { createMateria } from 'src/actions/materia';

import { fData } from 'src/utils/format-number';


import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { generateUsername, generatePass } from 'src/actions/users'

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const NewMateriaSchema = zod.object({
  name: zod.string().min(1, { message: 'Nombre es requerido!' }),
  grado: zod.number(),
  clase: zod.number(),
  docent: zod.number(),

});

// ----------------------------------------------------------------------

export function MateriaNewForm({ currentMateria }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentMateria?.name || '',
      grado: currentMateria?.clase || '',
      clase: currentMateria?.clase || '',
      docent: currentMateria?.docent || '',
    }),
    [currentMateria]
  );
  



  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewMateriaSchema),
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
      await createMateria({name:data.name, clase: data.clase , docent: data.docent});
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Creación exitosa!');
      router.push(paths.dashboard.materia.list);
      router.refresh();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const [DocentsData, setDocentsData] = useState([]);

  useEffect(() => {
    useGetDocents().then(result => setDocentsData(result.data));
  }, []);


  const [GradosData, setGradostData] = useState([]);
  useEffect(() => {
    getGrados().then(result => setGradostData(result.data));
  }, []);

  const [ClasesData, setClasesData] = useState([]);
  const handleSelectGrado = useCallback(async (grado) => {
    const res = await getClasesbyGrado(grado)
    setClasesData(res.data)

  }, []);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Box sx={{ p: 3 }}>

          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Datos:
          </Typography>

          <Stack  spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Field.Text
                name= "name"
                label="Nombre"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Select name="docent" label="Asignar docente">
                {DocentsData.map((docent) => (
                  <MenuItem key={docent.id} value={docent.id}>
                    {docent.nombres} {docent.apellidos}
                  </MenuItem>
                ))}
              </Field.Select>

            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
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
                      onClick={() => handleSelectGrado(grado.id)}
                    >
                      {grado.nombre}
                    </MenuItem>
                  ))}

                </Field.Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <Field.Select
                  name= "clase"
                  label="Seleccionar clase"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>
                  {ClasesData.map((clase) => (
                    <MenuItem
                      key={clase.id}
                      value={clase.id}
                    >
                      {clase.nombre}
                    </MenuItem>
                  ))}

                </Field.Select>
              </FormControl>

            </Stack>

          </Stack>
        </Box>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
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
