import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------


export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    logout: '/api/auth/logout',
    refresh: '/api/token/refresh',
    verify: '/api/token/verify'
  },
  users: {
    list: '/api/users',
    update: '/api/user-update/',
    actions: '/api/users/',
    count: '/api/users-count/',
  },
  students: {
    list: '/api/students',
    details: '/api/students-details/',
  },
  docents: {
    list: '/api/docents',
    details: '/api/docents-details/',
  },
  clases: {
    list: '/api/clases-list',
    details: '/api/clases-actions/',
    create: '/api/clases',
    clasesbygrado: '/api/grado-clases',
    get: '/api/clases-actions/',
    count: '/api/students-count/',
  },
  materias: {
    list: '/api/materias-list',
    details: '/api/materias-actions/',
    create: '/api/materias',
    get: '/api/materias-actions/',
    count: '/api/materias-count',
  },
  grados: {
    list: '/api/grados',
  },
  notas: {
    list: '/api/notas-list',
    details: '/api/notas-actions/',
    create: '/api/notas',
    get: '/api/notas-student',
    students: '/api/students-list',
    materias: '/api/notas-materia',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

