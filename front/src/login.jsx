//toda la estrucctura del login con sus clases para darle estilos en el css
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css'; // Asegúrate de importar el CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {    
        e.preventDefault();
        // Inicio de sesion y manejo de tockens
        

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