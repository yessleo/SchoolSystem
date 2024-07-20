'use client';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY, REFRESH_KEY } from './constant';
import { paths } from 'src/routes/paths';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  try {
    const params = { username, password };
    const res = await axios.post(endpoints.auth.signIn, params);
    const {refresh, access} = res.data;
    if (!access) {
      throw new Error('Access token not found in response');
    }

    setSession(access, refresh);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};


/** **************************************
 * Refresh token
 *************************************** */
const refreshToken = async () => {
  try {
    const params = {refresh: sessionStorage.getItem(REFRESH_KEY)};
    const res = await axios.post(endpoints.auth.refresh, params);
    if (res.status == 200) {
      const {refresh, access} = res.data;
      setSession(access, refresh);
      return true
    }
    else {
      alert('Token expired!');
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(REFRESH__KEY);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("role");
      window.location.href = paths.auth.jwt.signIn;
    }

  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign in
 *************************************** */
export const verifyToken = async () => {
  try {
    const token = sessionStorage.getItem(STORAGE_KEY)
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const params = {token: sessionStorage.getItem(REFRESH_KEY)};
      const res = await axios.post(endpoints.auth.verify, params);
      if (res.status == 200) {
        await refreshToken();
        return true
      }
      else {
        alert('Token expired!');
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(REFRESH_KEY);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");
        window.location.href = paths.auth.jwt.signIn;
        return false
      }
    }
    else {
      return false
    }

  } catch (error) {
    console.error('Error during verify token:', error);
    throw error;
  }
};


/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    const token = sessionStorage.getItem(STORAGE_KEY)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const params = {refresh: sessionStorage.getItem(REFRESH_KEY)};
    await axios.post(endpoints.auth.logout, params);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
