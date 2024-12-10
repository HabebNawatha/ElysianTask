import axios, { AxiosResponse } from 'axios';

// Define types for the data being passed to the API
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface GoogleLoginData {
  token: string;
}

interface FacebookLoginData {
  token: string;
}

interface ChangePasswordData {
    email: string;
    password: string;
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

export const forgotPassowrd = async (email: string): Promise<any> => {
    try{
        const response: AxiosResponse = await api.post("forgot-password", {email});
        return response.data;
    } catch (error) {
        console.error("Error during forgot passsword handling:", error);
        throw error;
    }
}

export const changePassword = async (userData:ChangePasswordData): Promise<any> => {
    try {
        const response: AxiosResponse = await api.post("/change-password" , userData);
        return response.data;
    } catch (error) {
        console.error("Error during change password:", error);
        throw error;
    }
}

export const chatMessage = async (message: string): Promise<any> => {
  try {
      const response: AxiosResponse = await axios.post('http://localhost:4000/message', {message});
      console.log('ChatGPT reply:',response.data.reply);
  } catch (error) {
      console.error('Error sending message:',error);
  }
}