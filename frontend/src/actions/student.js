import axios, { endpoints } from 'src/utils/axios';

export function generateUserAndPass(role, count){
    let key = "";
    let date = new Date();
    let year = date.getFullYear().toString();
    if (role === "admin"){
        key = "AD"
    } else if (role === "student"){
        key = "ST"
    }else if (role === "staff"){
        key = "AF"
    }else if (role === "docent"){
        key = "docent"
    }

    return `${year.slice(-2)}-${key}${count.toString().padStart(4, '0')}`;
}

export function generatePass(){
    length = Math.random() * (16 - 5) + 5;
    var result = "";
    characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  
  };

export async function useGetStudents() {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.students.list);
    if (res.status == 200) {
        console.log(res.data)
        return res;
    }
    else {
        return [];
    }
};



export const createStudent = async ({nombres, apellidos, direccion, fecha_nac, genero, contacto, periodo_escolar, guardian_nombres, guardian_apellidos,clase , user}) => {
    const params = {nombres, apellidos, direccion, fecha_nac, genero, contacto, periodo_escolar, guardian_nombres, guardian_apellidos,clase , user}
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    await axios.post(endpoints.students.list, params)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};


export async function getUser(id) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.students.details}${id}` : '';
    const res = await axios.get(URL);
    if (res.status == 200) {
        return res;
    }
    else {
        return {};
    }
};


export async function deleteStudent(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.students.details}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateStudent(id, {data}) {
    const token = sessionStorage.getItem('access_token');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.students.details}${id}` : '';
    const res = await axios.patch(URL, data);
    return res.data;
};
  