import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import filesImage from '../Images/files.png';

function Login() {
  const [formData, setFormData] = useState({ correo: '', contrasenia: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/iniciar_sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data[0]));
        setMessage('Inicio de sesión exitoso');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage('Credenciales incorrectas');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={filesImage} alt="Files Illustration" />
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="correo"
            placeholder="Nombre de usuario"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasenia"
            placeholder="Contraseña"
            value={formData.contrasenia}
            onChange={handleChange}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
        {message && <p className={message.includes('exitoso') ? 'success-message' : 'error-message'}>{message}</p>}
        <button className="register-button" onClick={() => navigate('/register')}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default Login;
