import axios, { AxiosResponse } from 'axios';

// Define types for the data being passed to the API
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface GoogleLoginData {
  token: string;
}

interface FacebookLoginData {
  token: string;
}

const api = axios.create({
  baseURL: 'http://localhost:5000/',
  timeout: 5000,
});

export const loginUser = async (loginData: LoginData): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post("/login", loginData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to handle user registration
export const registerUser = async (registerData: RegisterData): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post("/register", registerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function for Google login
export const googleLogin = async (accessToken: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post("/auth/google", {
      token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
};

// Function for Facebook login
export const facebookLogin = async (accessToken: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post("/auth/facebook", {
      token: accessToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error during Facebook login:", error);
    throw error;
  }
};
