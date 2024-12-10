import React, { useState } from 'react';
import { facebookLogin, forgotPassword, googleLogin, loginUser, registerUser } from "../services/api";
import './RegistrationPage.css';
import img from '../images/image.png'
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const RegistrationPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [toastMessage,setToastMessage] = useState("Login Successful");
    const [showToastMessage,setShowToastMessage] = useState(false);
    const facebookAPPId = process.env.REACT_APP_FACEBOOK_APP_ID;

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button clicked");

        const loginData = { email, password };
        try {
            const response = await loginUser(loginData);
            console.log("Login successful", response);
            setToastMessage("Login successful!");
            setShowToastMessage(true);
        } catch (error) {
            console.error("login failed", error.response ? error.response.data : error);
            setErrorMsg("Login failed! Please check your credentails.");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleForgotPassword = async () => {
        console.log("Forgot password clicked");
        try {
            const response = await forgotPassword(email);
            console.log("Forgot password successful", response);
            setToastMessage("Email sent successfuly!");
            setShowToastMessage(true);
        } catch (error) {
            console.error("Forgot password failed", error.response ? error.response.data : error);
            setErrorMsg(error.response?.data?.message || "An unknown error occurred.");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Google login successfuly", tokenResponse);
    
            try {
                const {access_token} = tokenResponse;
                if (access_token){
                    const data = await googleLogin(access_token);
                    console.log("Google Auth Response:", data);
                    setToastMessage("Google login successful!");
                    setShowToastMessage(true);
                }else {
                    setErrorMsg("Access token not found.");
                }
            } catch (error) {
                setErrorMsg("Google login failed! Please try again.");
                setTimeout(() => {
                    setErrorMsg("");
                }, 3000);
            }
        },
        onError: () => {
            setErrorMsg("Google login failed! Please try again.");
            console.error("Google login error occurred.");
        },
    });

    const handleFacebookLogin = async (response) => {
        if (response?.status == "unknown") {
            setErrorMsg("Something went wrong with facebook Login.");
            return;
        }
        try {
            const data = await facebookLogin(response.accessToken);
            console.log("Facebook Auth Response:", data);
            setToastMessage("Facebook login successful!");
            setShowToastMessage(true);
        } catch (error) {
            setErrorMsg("Facebook login failed! Please try again.");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Register button clicked");
        const registerData = { email, password };
        try {
            const response = await registerUser(registerData);
            console.log("Register successful", response);
            setToastMessage("Account Created Successfuly, Now you can Log in!");
            setShowToastMessage(true);
        } catch (error) {
            console.error("Register failed", error.response ? error.response.data : error);
            setErrorMsg(error.response?.data?.message || "An unknown error occurred.");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleCloseToast = () => {
        setShowToastMessage(false);
    }

    return (
        <div className='container'>
            <div className='split-container'>
                <div className='welcome-wrapper'>
                    <div className='image-wrapper'>
                        <img src={img} />
                    </div>
                    <h2>Welcome aboard my friend</h2>
                    <p>just a couple of clicks and we start</p>
                </div>
                <div className='form-wrapper'>
                    <h4>Log in</h4>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {errorMsg &&  <p className={`error-message ${errorMsg ? "fade-in" : "fade-out"}`}>
                                {errorMsg}
                            </p>}
                        <div
                            className="divider-span"
                            onClick={handleForgotPassword}>
                            Forgot password?
                        </div>
                        <div className='form-buttons'>
                            <button className="submit-button" type="submit">Log in</button>
                            <div className="divider-text">Or</div>
                            <div className='form-social-buttons'>
                                <button type="button" onClick={handleGoogleLogin}> Google</button>
                                <FacebookLogin appId={facebookAPPId} autoLoad={false} fields="name,email,picture" callback={handleFacebookLogin}
                                render={renderProps => (
                                    <button onClick={renderProps.onClick}> Facebook </button>
                                )}
                                />
                            </div>
                            <div className="divider-text">Have no account yet?</div>
                            <button className="register-button" type="button" onClick={handleRegister}>Register</button>
                        </div>
                    </form>
                </div>
            </div>
            {showToastMessage && (
                 <div className="toast-message">
                 <span>{toastMessage}</span>
                 <button className="close-toast" onClick={handleCloseToast}>X</button>
             </div>
            )}
        </div>
    )
}

export default RegistrationPage;