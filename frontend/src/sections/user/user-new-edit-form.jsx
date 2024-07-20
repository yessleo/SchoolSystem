import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
import { createUser } from 'src/actions/users';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  username: zod.string().min(1, { message: 'username es requerido!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password es requerido!' })
    .min(6, { message: 'Password debe tener al menos 6 caracteres!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

export default function InputAdornments() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
}
export function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || '',
      username: currentUser?.username || '',
      password: currentUser?.password || '',
      role: currentUser?.role || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const password = useBoolean();

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createUser({ status: data.status, username: data.username, password: data.password , role:data.role});
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Creación exitosa!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Box sx={{ mb: 5 }} >
          <Box
            component="img"
            alt="illustration-user"
            src={`${CONFIG.site.basePath}/assets/illustrations/illustration-user.webp`}
            sx={{
              width: 640,
              objectFit: 'cover',
              aspectRatio: '4/3',
            }}
          />
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box 
              width={200}
              display="flex"
              gap={2}
              p={2}
            >
              <FormControlLabel
                labelPlacement="start"
                value = "activo"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value == 'activo'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'activo' : 'inactivo')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                  <Label
                    color={
                      (values.status === 'activo' && 'success') ||
                      (values.status === 'inactivo' && 'error') ||
                      'error'
                    }
                    sx={{ mb: 0.5 }}
                  >
                    
                    Usuario {values.status === 'activo' ? 'activo':'inactivo'}
                  </Label>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
            >
              <Field.Text name="username" label="Username" />
              <Field.Select name="role" label="Role">
                {USER_ROLES_OPTIONS.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                name="password"
                label="Password"
                placeholder="6+ caracteres"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify icon="solar:copy-bold" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            

            <Stack adirection="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" color="secondary">
                  Generar
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Guardar usuario
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
