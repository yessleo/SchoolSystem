'use client';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export const Logo = forwardRef(
  ({ width = 40, height = 40, disableLink = false, className, href = '/', sx, ...other }, ref) => {
    const theme = useTheme();

    const gradientId = useId();

    const PRIMARY_LIGHT = theme.vars.palette.primary.light;

    const PRIMARY_MAIN = theme.vars.palette.primary.main;

    const PRIMARY_DARK = theme.vars.palette.primary.dark;

    /*
     * OR using local (public folder)
     * const logo = ( <Box alt="logo" component="img" src={`${CONFIG.site.basePath}/logo/logo-single.svg`} width={width} height={height} /> );
     */

    const logo = (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 256">
        <defs>
          <linearGradient id={`${gradientId}-1`} x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={PRIMARY_DARK} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id={`${gradientId}-2`} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>

          <linearGradient id={`${gradientId}-3`} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY_LIGHT} />
            <stop offset="100%" stopColor={PRIMARY_MAIN} />
          </linearGradient>
        </defs>

        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill={`url(#${`${gradientId}-1`})`}
            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
            d="M665 2355 c-319 -113 -594 -212 -611 -221 -34 -17 -54 -50 -54 -89 0 -36 42 -78 99 -99 l51 -18 0 -112 0 -112 -36 -35 c-20 -18 -54 -56 -76 -83 -42 -53 -44 -81 -11 -118 20 -22 71 -23 101 -2 22 15 22 14 22 -24 0 -81 80 -124 130 -70 19 21 20 34 20 260 0 131 4 238 9 238 4 0 219 -75 477 -166 388 -137 476 -165 509 -161 22 2 303 98 625 211 496 176 589 211 613 237 39 43 33 108 -15 138 -41 26 -1208 431 -1240 431 -18 -1 -294 -93 -613 -205z"
          />
          <path
            fill={`url(#${`${gradientId}-2`})`}
            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
            d="M470 1530 c0 -194 -6 -184 156 -248 249 -97 424 -134 644 -135 170 -1 247 9 419 54 139 37 345 116 377 146 23 21 24 26 24 184 0 125 -3 160 -12 156 -7 -3 -170 -69 -363 -148 l-350 -142 -85 0 -85 0 -359 146 c-198 81 -361 147 -363 147 -2 0 -3 -72 -3 -160z"
          />
          <path
            fill={`url(#${`${gradientId}-3`})`}
            transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
            d="M460 1071 c-104 -28 -423 -160 -443 -183 -15 -18 -17 -49 -17 -324 0 -291 1 -305 20 -324 35 -35 60 -31 196 26 l107 44 407 -145 c224 -79 431 -150 461 -156 64 -14 166 -7 233 16 46 16 635 268 931 398 122 54 143 67 168 103 85 121 3 285 -142 287 -37 1 -97 -21 -315 -115 l-268 -116 -42 -78 c-33 -62 -52 -86 -90 -111 -59 -40 -118 -57 -172 -49 -68 9 -567 194 -586 217 -38 46 -8 119 48 119 15 0 136 -40 271 -90 144 -53 259 -90 281 -90 75 0 142 69 142 145 0 51 -28 105 -66 127 -36 21 -756 284 -833 304 -75 19 -211 17 -291 -5z"
          />
        </g>
      </svg>
    );

    return (
      <NoSsr
        fallback={
          <Box
            width={width}
            height={height}
            className={logoClasses.root.concat(className ? ` ${className}` : '')}
            sx={{
              flexShrink: 0,
              display: 'inline-flex',
              verticalAlign: 'middle',
              ...sx,
            }}
          />
        }
      >
        <Box
          ref={ref}
          component={RouterLink}
          href={href}
          width={width}
          height={height}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          aria-label="logo"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...(disableLink && { pointerEvents: 'none' }),
            ...sx,
          }}
          {...other}
        >
          {logo}
        </Box>
      </NoSsr>
    );
  }
);
