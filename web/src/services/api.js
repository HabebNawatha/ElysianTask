import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/',
    timeout:5000,
});

export const loginUser = async (loginData) => {
    try {
        const response = await api.post("/login", loginData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
