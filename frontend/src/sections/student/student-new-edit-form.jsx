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
import { createStudent } from 'src/actions/student';

import { fData } from 'src/utils/format-number';


import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { generateUsername, generatePass } from 'src/actions/users'

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const NewStudentSchema = zod.object({
  nombres: zod.string().min(1, { message: 'Nombre es requerido!' }),
  apellidos: zod.string().min(1, { message: 'Apellido es requerido!' }),
  fecha_nac: schemaHelper.date({ message: { required_error: 'Fecha de nacimiento es requerida!' } }),
  contacto: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  direccion: zod.string().min(1, { message: 'Direccion es requerida!' }),
  genero: zod.string(),
  guardian_nombres: zod.string().min(1, { message: 'Guardian es requerido!' }),
  guardian_apellidos: zod.string().min(1, { message: 'Guardian es requerido!' }),
  clase: zod.number(),
  periodo_escolar: zod.number(),
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

export function StudentNewEditForm({ currentStudent }) {
  const router = useRouter();

  const [user, setUser] = useState('');
  useEffect(() => {
    generateUsername("student").then(result => setUser(result.username));
  }, []);

  console.log(user)

  const defaultValues = useMemo(
    () => ({
      nombres: currentStudent?.nombres || '',
      apellidos: currentStudent?.apellidos || '',
      fecha_nac: currentStudent?.fecha_nac || '',
      contacto: currentStudent?.contacto || '',
      direccion: currentStudent?.direccion || '',
      genero: currentStudent?.genero || '',
      guardian_nombres: currentStudent?.guardian_nombres || '',
      guardian_apellidos: currentStudent?.guardian_apellidos || '',
      periodo_escolar: currentStudent?.periodo_escolar || new Date().getFullYear(),
      grados: currentStudent?.clase || '',
      clase: currentStudent?.clase || '',
      username: user,
      password: currentStudent?.user.password || generatePass(),
      role: currentStudent?.user.role || 'student',
      status: currentStudent?.status || 'activo',
    }),
    [currentStudent]
  );



  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewStudentSchema),
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
      await createStudent({nombres:data.nombres, apellidos: data.apellidos, direccion: data.direccion, fecha_nac: data.fecha_nac, genero: data.genero, contacto: data.contacto, periodo_escolar:data.periodo_escolar, guardian_nombres: data.guardian_nombres, guardian_apellidos: data.guardian_apellidos, clase: data.clase , user: {username: user, password: data.password, role: data.role, status: data.status}});
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Creación exitosa!');
      router.push(paths.dashboard.student.list);
      router.refresh();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const copyToClipboard = () => {
    const isCopy = copy(defaultValues.password);
    if (isCopy) {
      toast.success("password copiada");
    }
  };

  const GENDER_OPTIONS = [
    { value: 'F', label: 'Femenino' },
    { value: 'M', label: 'Masculino' },
  ];


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
                  <IconButton  edge="end">
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

            <Box sx={{ m: 1 }}>
                <Field.Text
                  name="direccion"
                  label="Direccion"
                  InputLabelProps={{ shrink: true }}
                />
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Field.Text name= "guardian_nombres" label="Nombres Guardian" InputLabelProps={{ shrink: true }} />
              <Field.Text name="guardian_apellidos" label="Apellidos Guardian" InputLabelProps={{ shrink: true }}/>
              <Field.Phone name="contacto" label="Contacto" />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
  
              <Box sx={{ m: 1, minWidth: 200 }}>
                <Field.Text name="periodo_escolar" label="Periodo electivo" />
              </Box>
              
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <Field.Select
                  name= "grados"
                  label="Grado"
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
                  label="Seleccionar  clase"
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
