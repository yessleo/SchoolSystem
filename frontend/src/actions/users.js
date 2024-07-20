
import axios, { endpoints } from 'src/utils/axios';
import { useEffect, useState} from 'react';


export async function GetuserCount(role) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = role ? `${endpoints.users.count}${role}` : '';
    const res = await axios.get(URL)
    return res.data
    
};

async function userCount(role) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = role ? `${endpoints.users.count}${role}` : '';
    const res = await axios.get(URL)
    return res.data.count
    
};

export async function generateUsername(role){
    const count = await userCount(role)
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
        key = "DC"
    }

    return {username:`${year.slice(-2)}-${key}${count.toString().padStart(4, '0')}`};
}

export function generatePass(){
    var length = Math.random() * (16 - 5) + 5;
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  
};

export async function useGetUsers() {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.get(endpoints.users.list)
    if (res.status == 200) {
        return res;
    }
    else {
        return [];
    }
};



export const createUser = async ({status, username, password , role}) => {
    const params = { status, username, password , role};
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const res = await axios.post(endpoints.users.list, params);
    if (res.status == 200) {
        console.log("New user created")
    }
    else {
        return [];
    }
};


export async function getUser(id) {
  const URL = id ? `${endpoints.users}?id=${id}` : '';
  const res = await axios.get(URL);
  return res.json().data;
};


export async function deleteUser(id) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = id ? `${endpoints.users.actions}${id}` : '';
    console.log(URL)
    await axios.delete(URL)
        .then(response => {
            console.log(response.status);
        })
        .catch(error => {
            console.error(error);
    });
};

export async function updateUser(pk, {data}) {
    const token = sessionStorage.getItem('access_token')
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const URL = pk ? `${endpoints.users.update}${pk}` : '';
    const res = await axios.put(URL, data);
    return res.data;
};

