
import axios, { endpoints } from 'src/utils/axios';

export async function StudentsCount(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.clases.count}${id}` : '';
    const res = await axios.get(URL)
    return res.data
};

export async function getClasesbyGrado(grado) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = grado ? `${endpoints.clases.clasesbygrado}?grado=${grado}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};

export async function getGrados() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.grados.list);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};

export async function getclase(id) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.clases.get}${id}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


export async function useGetClases() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.clases.list);
    if (res.status == 200) {
        console.log(res.data)
        return res;
    }
    else {
        return [];
    }
};


export const createClase = async ({nombre, grado, periodo_escolar}) => {
    const params = {nombre, grado, periodo_escolar}
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    await axios.post(endpoints.clases.create, params)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};


export async function deleteClase(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.clases.details}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateClase(id, {data}) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.clases.details}${id}` : '';
    const res = await axios.patch(URL, data);
    return res.data;
};


