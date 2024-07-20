
import axios, { endpoints } from 'src/utils/axios';



export async function getMaterias(id) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.materias.get}${id}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


export async function useGetMaterias() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.materias.list);
    if (res.status == 200) {
        console.log(res.data)
        return res;
    }
    else {
        return [];
    }
};

export async function useGetCount() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.materias.count);
    if (res.status == 200) {
        console.log(res.data)
        return res.data;
    }
    else {
        return [];
    }
};



export const createMateria = async ({name, clase, docent}) => {
    const params = {name, clase, docent}
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    await axios.post(endpoints.materias.create, params)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};


export async function deleteMateria(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.materias.details}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateMateria(id, {data}) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.materias.details}${id}` : '';
    const res = await axios.patch(URL, data);
    return res.data;
};


