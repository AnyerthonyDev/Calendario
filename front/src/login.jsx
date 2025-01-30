//toda la estrucctura del login con sus clases para darle estilos en el css
import React, { useState } from 'react';

import './login.css'; // Asegúrate de importar el CSS
import axios from 'axios';
import config from '../config'; // Import the config file for the API URL

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {    
        e.preventDefault();
        try {
            const response = await axios.post(`${config.apiUrl}/login`, { email, password });
            if (response.data.status === 1 && response.data.token) {
                // Save the token in localStorage or state
                localStorage.setItem('token', response.data.token);
                // Redirect to the calendar page or another page
                window.location.href = '/calendar';
            } else {
                alert(response.data.resultado);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Iniciar Sesión</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={handleEmailChange}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className="login-input"
                />
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>            
        </div>
    );
}

export default Login;