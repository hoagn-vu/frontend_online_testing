import React, { useState, useEffect, useContext } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPage.css'

const Login = () => {

    return (
        <div className="login-container">
            <div className="login-overlay">
                <div className="login-form-container">
                    <LoginForm></LoginForm>
                </div>
            </div>
        </div>    
    )
}

export default Login;