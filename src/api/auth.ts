import axios from 'axios';

const API_URL = 'https://inai-col3.fishrungames.com';

// Указываем правильные пути из твоего Swagger
const REGISTER_ENDPOINT = '/api/register/'; 
const LOGIN_ENDPOINT = '/api/login/';

export const registerUser = async (username: string, password: string) => {
    return axios.post(`${API_URL}${REGISTER_ENDPOINT}`, { username, password });
};

export const loginUser = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, { username, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('username', username);
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};