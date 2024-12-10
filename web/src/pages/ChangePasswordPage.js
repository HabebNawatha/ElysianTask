import React, { useState } from 'react';
import { changePassword } from "../services/api";
import './ChangePasswordPage.css';
import img from '../images/image.png'

const ChangePasswordPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [toastMessage,setToastMessage] = useState("Login Successful");
    const [showToastMessage,setShowToastMessage] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        console.log("Change password clicked");
        const userData = {email , password};
        try {
            const response = await changePassword(userData);
            console.log("Change password successful", response);
            setToastMessage("Password changed successfuly, Now you can log in! http://localhost:3000");
            setShowToastMessage(true);
        } catch (error) {
            console.log("change failed", error.response ? error.response.data : error);
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
                    <h2>Change your password!</h2>
                    <p>just a couple of clicks and we are back</p>
                </div>
                <div className='form-wrapper'>
                    <h4>Change Password</h4>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {errorMsg &&  <p className={`error-message ${errorMsg ? "fade-in" : "fade-out"}`}>
                                {errorMsg}
                            </p>}
                        <div className='form-buttons'>
                            <button className="submit-button" type="submit">Change Password</button>
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

export default ChangePasswordPage;