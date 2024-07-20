import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormControl from '@mui/material/FormControl';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Label } from 'src/components/label';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS, USER_ROLES_OPTIONS } from 'src/_mock';
import { getClasesbyGrado, getGrados, getclase } from 'src/actions/clases';
import { updateStudent } from 'src/actions/student';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const MateriaQuickEditSchema = zod.object({
  nombres: zod.string().min(1, { message: 'Nombre es requerido!' }),
  apellidos: zod.string().min(1, { message: 'Apellido es requerido!' }),
  fecha_nac: schemaHelper.date({ message: { required_error: 'Fecha de nacimiento es requerida!' } }),
  contacto: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  direccion: zod.string(),
  guardian_nombres: zod.string(),
  guardian_apellidos: zod.string(),
  genero: zod.string(),
  clase: zod.string(),
  status: zod.string(),
});


// ----------------------------------------------------------------------

export function MateriaQuickEditForm({ currentStudent, open, onClose }) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      nombres: currentStudent?.nombres,
      apellidos: currentStudent?.apellidos,
      fecha_nac: currentStudent?.fecha_nac,
      contacto: currentStudent?.contacto,
      direccion: currentStudent?.direccion,
      genero: currentStudent?.genero,
      guardian_nombres: currentStudent?.guardian_nombres || '',
      guardian_apellidos: currentStudent?.guardian_apellidos || '',
      clase:  '',
      status: currentStudent?.user.status || '',
    }),
    [currentStudent]
  );

  const [GradosData, setGradostData] = useState([]);
  useEffect(() => {
    getGrados().then(result => setGradostData(result.data));
  }, []);

  const [ClasesData, setClasesData] = useState([]);
  
  const [currentClase, setcurrentClase] = useState([]);

  useEffect(() => {
    getclase(currentStudent.clase).then(result => setcurrentClase(result.data));
  }, []);

  const handleSelectGrado = useCallback(async (grado) => {
    const res = await getClasesbyGrado(grado)
    setClasesData(res.data)

  }, []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(StudentQuickEditSchema),
    defaultValues,
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("update");
    await updateStudent(currentStudent.id , {data})

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      router.refresh();

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const GENDER_OPTIONS = [
    { value: 'F', label: 'Femenino' },
    { value: 'M', label: 'Masculino' },
  ];

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 1000 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Editar</DialogTitle>

        <DialogContent>
          <Card>
            <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ p: 3, bgcolor: 'background.neutral' }}
            >

              <Label>
                Username: {currentStudent.user.username}
              </Label>
              <Field.Select name="status" label="Status">
                {USER_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>
            <Box sx={{ p: 3 }}>
              <Stack justifyContent="flex-end" >
                <Label variant="soft" color = "success" >
                  Periodo: {currentClase.periodo_escolar}
                </Label>
              </Stack>
              <Box spacing={2} sx={{ mt: 3 }}></Box>
              <Label variant="soft" sx={{ color: 'text.disabled', mb: 3 }}>
                {currentClase.nombre}
              </Label>
             
              <Stack  spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Field.Text name= "nombres" label="Nombres" InputLabelProps={{ shrink: true }} />
                  <Field.Text name="apellidos" label="Apellidos" InputLabelProps={{ shrink: true }}/>
                  <Field.DatePicker  name="fecha_nac" label="Fecha Nacimiento" />
                  <Field.Select name="genero" label="Genero">
                    {GENDER_OPTIONS.map((genero) => (
                      <MenuItem key={genero.value} value={genero.value}>
                        {genero.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Stack>

                <Box sx={{ m: 1 }}>
                  <Field.Text name="direccion" label="Direccion" InputLabelProps={{ shrink: true }} />
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Field.Text name= "guardian_nombres" label="Nombres Guardian" InputLabelProps={{ shrink: true }} />
                  <Field.Text name="guardian_apellidos" label="Apellidos Guardian" InputLabelProps={{ shrink: true }}/>
                  <Field.Phone name="contacto" label="Contacto" />
                </Stack>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <FormControl>

                    <Field.Select
                      size = "medium"
                      name= "grados"
                      label="Grado"
                      value =  {currentClase.id_grado}
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
                  <FormControl>
                    <Field.Select
                      name= "clase"
                      label="Cambiar clase"
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
                </Box>
                
              </Stack>
            </Box>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Actualizar
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
