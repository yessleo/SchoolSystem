


import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

export async function getStudentsByClass(clase) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = clase ? `${endpoints.notas.students}?clase=${clase}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


const getNotas = async (id) =>  {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.notas.get}?student=${id}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


// export async function useGetNotas() {
//     const token = sessionStorage.getItem('access_token');
//     axios.defaults.headers.common.Authorization = `Bearer ${token}`;
//     const res = await axios.get(endpoints.notas.list);
//     if (res.status == 200) {
//         console.log(res.data)
//         return res;
//     }
//     else {
//         return [];
//     }
// };

const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

export function useGetNotas(materia) {
    const url = `${endpoints.notas.materias}?materia=${materia}`;
    const token = sessionStorage.getItem('access_token');
    const headers = axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  
    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, headers, swrOptions);
  
    const memoizedValue = useMemo(
      () => ({
        notas: data || [],
        notasLoading: isLoading,
        notasError: error,
        notasValidating: isValidating,
        notasEmpty: !isLoading && !data.length,
      }),
      [data, error, isLoading, isValidating]
    );
  
    return memoizedValue;
}

export const createNota = async (students, {materia, p_parcial, s_parcial, periodo_escolar}) => {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log(students)
    for(let i = 0; i < students.length; i++) {
        console.log(students[i].id)
        let id = students[i].id
        let res = await getNotas(id)
        console.log(res.data)
        let notas = res.data
        if (notas.length) {
            notas = notas.filter((nota) => nota.id_materia === materia);
            if (notas.length) {
                console.log("enter")
                console.log(notas)
            }else{
                console.log("create")
                let params = {materia, estudiante: id,  p_parcial, s_parcial, periodo_escolar}
                await axios.post(endpoints.notas.create, params)
                .then(response => {
                    console.log(response.status);
                })
                .catch(error => {
                    console.error(error);
                });
            }
        }else{
            console.log("create")
            let params = {materia, estudiante: id,  p_parcial, s_parcial, periodo_escolar}
            await axios.post(endpoints.notas.create, params)
            .then(response => {
                console.log(response.status);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }


};



export async function deleteNotas(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.notas.details}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateNota(id, {p_parcial, s_parcial}) {
    
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.notas.details}${id}` : '';
    const params = {p_parcial, s_parcial}
    console.log(params)
    await axios.patch(URL, params)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};


