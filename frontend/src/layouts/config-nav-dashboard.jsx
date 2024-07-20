import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  class: icon('ic-class'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------


export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'User',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
        ],
        roles: ['admin'],
      },
      {
        title: 'Estudiantes',
        path: paths.dashboard.student.root,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.dashboard.student.list },
          { title: 'Create', path: paths.dashboard.student.new },
        ],
        roles: ['admin'],
      },
      {
        title: 'Docentes',
        path: paths.dashboard.docent.root,
        icon: ICONS.user,
        children: [
          { title: 'List', path: paths.dashboard.docent.list },
          { title: 'Create', path: paths.dashboard.docent.new },
        ],
        roles: ['admin'],
      },
      {
        title: 'Clases',
        path: paths.dashboard.clase.root,
        icon: ICONS.class,
        children: [
          { title: 'List', path: paths.dashboard.clase.list },
          { title: 'Create', path: paths.dashboard.clase.new },
        ],
        roles: ['admin'],
      },
      {
        title: 'Materias',
        path: paths.dashboard.materia.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.dashboard.materia.list },
          { title: 'Create', path: paths.dashboard.materia.new },
        ],
        roles: ['admin'],
      },
    ],
  },
];

