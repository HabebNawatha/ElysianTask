import React, { useState } from 'react';
import { loginUser } from "../services/api";
import './RegistrationPage.css';
import img from '../images/image.png'

const RegistrationPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [toastMessage,setToastMessage] = useState("Login Successful");
    const [showToastMessage,setShowToastMessage] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button clicked");

        const loginData = { email, password };
        try {
            const response = await loginUser(loginData);
            console.log("Login successful", response);
            setShowToastMessage(true);
        } catch (error) {
            console.error("login failed", error.response ? error.response.data : error);
            setErrorMsg("Login failed! Please check your credentails.");
            setTimeout(() => {
                setErrorMsg("");
            }, 3000);
        }
    }

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
    }

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
    }

    const handleFacebookLogin = () => {
        console.log("Facebook  login clicked");
    }

    const handleRegister = () => {
        console.log("Register button clicked");
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
                                <button type="button" onClick={handleFacebookLogin}> Facebook</button>
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