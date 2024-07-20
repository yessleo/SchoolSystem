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
import { updateDocent } from 'src/actions/docent';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const DocentQuickEditSchema = zod.object({
  nombres: zod.string().min(1, { message: 'Nombre es requerido!' }),
  apellidos: zod.string().min(1, { message: 'Apellido es requerido!' }),
  fecha_nac: schemaHelper.date({ message: { required_error: 'Fecha de nacimiento es requerida!' } }),
  contacto: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  direccion: zod.string(),
  genero: zod.string(),
  status: zod.string(),
});


// ----------------------------------------------------------------------

export function DocentQuickEditForm({ currentDocent, open, onClose }) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      nombres: currentDocent?.nombres,
      apellidos: currentDocent?.apellidos,
      fecha_nac: currentDocent?.fecha_nac,
      contacto: currentDocent?.contacto,
      direccion: currentDocent?.direccion,
      genero: currentDocent?.genero,
      status: currentDocent?.user.status || '',
    }),
    [currentDocent]
  );



  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(DocentQuickEditSchema),
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
    await updateDocent(currentDocent.id , {data})

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
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
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

              <Label sx={{ width: 2000 }} variant = "standard"> 
                Username: {currentDocent.user.username}
              </Label>
              <Field.Select size ="small" name="status" label="Status" sx={{ width: 1 }}>
                {USER_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>
            <Box sx={{ p: 3 }}>
              <Box spacing={2} sx={{ mt: 3 }}></Box>
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


                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <Box sx={{ width: 3000 }}>
                  <Field.Text name="direccion" label="Direccion" InputLabelProps={{ shrink: true }} />
                </Box>
                  <Field.Phone name="contacto" label="Contacto" />
                </Stack>
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
