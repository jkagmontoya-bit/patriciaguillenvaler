import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(`Error con Google: ${err.message}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="font-serif section-title">Crear Cuenta</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="text" 
            placeholder="Nombre completo" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña (mín. 6 caracteres)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength="6"
          />
          <button type="submit" className="btn">Registrarse</button>
        </form>
        
        <div className="auth-separator">
          <span>O</span>
        </div>
        
        <button onClick={handleGoogleLogin} className="btn-google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
          Regístrate con Google
        </button>

        <p className="auth-switch">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
