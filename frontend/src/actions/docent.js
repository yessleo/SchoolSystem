import axios, { endpoints } from 'src/utils/axios';

export async function useGetDocents() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.docents.list);
    if (res.status == 200) {
        console.log(res.data)
        return res;
    }
    else {
        return [];
    }
};



export const createDocent = async ({nombres, apellidos, direccion, fecha_nac, genero, contacto, user}) => {
    const params = {nombres, apellidos, direccion, fecha_nac, genero, contacto, user}
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    await axios.post(endpoints.docents.list, params)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};


export async function getDocent(id) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.docents.details}${id}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


export async function deleteDocent(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.docents.details}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateDocent(id, {data}) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.docents.details}${id}` : '';
    const res = await axios.patch(URL, data);
    return res.data;
};
  