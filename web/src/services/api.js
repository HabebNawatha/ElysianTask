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

export const registerUser = async (registerData) => {
    try {
        const response = await api.post("/register" , registerData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const googleLogin = async (accessToken) => {
    try {
        const response = await api.post("/auth/google", {
            token: accessToken,
        });
        return response.data;
    } catch (error) {
        console.error("Error during Google login:", error);
        throw error;
    }
};

export const facebookLogin = async (accessToken) => {
    try {
        const response = await api.post("/auth/facebook" , { token: accessToken});
        return response.data;
    } catch ( error ) {
        console.error("Error during Facebook login:", error);
        throw error;
    }
};