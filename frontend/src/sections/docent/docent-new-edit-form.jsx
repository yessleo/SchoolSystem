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
import { createDocent } from 'src/actions/docent';

import { fData } from 'src/utils/format-number';


import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { generateUsername, generatePass } from 'src/actions/users'

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const NewDocentSchema = zod.object({
  nombres: zod.string().min(1, { message: 'Nombre es requerido!' }),
  apellidos: zod.string().min(1, { message: 'Apellido es requerido!' }),
  fecha_nac: schemaHelper.date({ message: { required_error: 'Fecha de nacimiento es requerida!' } }),
  contacto: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  direccion: zod.string().min(1, { message: 'Direccion es requerida!' }),
  genero: zod.string(),
  username: zod.string(),
  role: zod.string().min(1, { message: 'Role is requerido!' }),
  password: zod
    .string()
    .min(1, { message: 'Password es requerido!' })
    .min(6, { message: 'Password debe tener al menos 6 caracteres!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export function DocentNewEditForm({ currentDocent }) {
  const router = useRouter();

  const [user, setUser] = useState('');
  useEffect(() => {
    generateUsername("docent").then(result => setUser(result.username));
  }, []);


  const defaultValues = useMemo(
    () => ({
      nombres: currentDocent?.nombres || '',
      apellidos: currentDocent?.apellidos || '',
      fecha_nac: currentDocent?.fecha_nac || '',
      contacto: currentDocent?.contacto || '',
      direccion: currentDocent?.direccion || '',
      genero: currentDocent?.genero || '',
      username: user,
      password: currentDocent?.user.password || generatePass(),
      role: currentDocent?.user.role || 'docent',
      status: currentDocent?.status || 'activo',
    }),
    [currentDocent]
  );



  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewDocentSchema),
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
      await createDocent({nombres:data.nombres, apellidos: data.apellidos, direccion: data.direccion, fecha_nac: data.fecha_nac, genero: data.genero, contacto: data.contacto , user: {username: user, password: data.password, role: data.role, status: data.status}});
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Creación exitosa!');
      router.push(paths.dashboard.docent.list);
      router.refresh();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const copyToClipboard = () => {
    const isCopy = copy(currentDocent.password);
    if (isCopy) {
      toast.success("password copiada");
    }
  };

  const GENDER_OPTIONS = [
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3, bgcolor: 'background.neutral' }}
        >

            <Field.Text 
              InputProps={{ readOnly: true, }} name="username" label="Username" value = {user} />
            <Field.Text name="password" label="Password"
              InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <Iconify icon='solar:copy-bold' />
                  </IconButton>
                </InputAdornment>
              ),
            }} />

            <Field.Text InputProps={{ readOnly: true, }} name="role" label="Role" />

            <Field.Select  name="status" label="Status" InputLabelProps={{ shrink: true }}>
              {['activo', 'inactivo'].map((option) => (
                <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                  {option}
                </MenuItem>
              ))}
            </Field.Select>
        </Stack>

        <Box sx={{ p: 3 }}>

          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Datos:
          </Typography>

          <Stack  spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Field.Text
                name= "nombres"
                label="Nombres"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text
                name="apellidos"
                label="Apellidos"
                InputLabelProps={{ shrink: true }}
              />
              <Field.DatePicker  name="fecha_nac" label="Fecha Nacimiento" InputLabelProps={{ shrink: true }} />
              <Field.Select name="genero" label="Genero">
                    {GENDER_OPTIONS.map((genero) => (
                      <MenuItem key={genero.value} value={genero.value}>
                        {genero.label}
                      </MenuItem>
                    ))}
                  </Field.Select>

            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Box sx={{ width: 3000 }}>
                <Field.Text
                  name="direccion"
                  label="Direccion"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Field.Phone name="contacto" label="Contacto" />
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
