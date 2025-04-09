import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import filesImage from '../Images/files.png';

function Login() {
  const [formData, setFormData] = useState({ nombre_usuario: '', contrasenia: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Se reemplaza la llamada fetch con la búsqueda en localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(u =>
      u.nombre_usuario === formData.nombre_usuario &&
      u.contrasenia === formData.contrasenia
    );
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setMessage('Inicio de sesión exitoso');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setMessage('Credenciales incorrectas');
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
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={formData.nombre_usuario}
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
