'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function RoleBasedGuard({ sx, children, hasContent, currentRole, acceptRoles }) {
  if (typeof acceptRoles !== 'undefined' && !acceptRoles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permiso denegado
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            No tiene permiso para acceder a esta pasgina.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
