import axios from 'axios';
import Session from './session';

// default axios config
/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/econtent';
} else {
  axios.defaults.baseURL = 'http://econtent.i2mago.com:8095/econtent';
}

axios.defaults.headers.get['Cache-Control'] = 'no-cache';
axios.defaults.headers.get['Pragma'] = 'no-cache';
axios.defaults.withCredentials = true;

// Add a request interceptor
/* eslint-disable no-undef */
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    const session = Session.get() || {};
    if (session && session.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.token}`,
      };
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
/* eslint-disable no-undef */
axios.interceptors.response.use(
  response => {
    // Do something with response data
    const { data } = response;
    if (data.code === 0) {
      return data;
    } else {
      return Promise.reject(data);
    }
  },
  error => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
