import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import filesImage from '../Images/files.png';

function Register() {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    contrasenia: '',
    foto: null,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Se elimina la llamada fetch y se almacena el usuario en localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      id_usuario: Date.now(),
      nombre_usuario: formData.nombre_usuario,
      correo: formData.correo,
      contrasenia: formData.contrasenia,
      url_foto: formData.foto ? URL.createObjectURL(formData.foto) : '',
    };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    setMessage('Registro exitoso');
    setTimeout(() => navigate('/login'), 2000);
  };
  
  return (
    <div className="register-container">
      <div className="register-image">
        <img src={filesImage} alt="Files Illustration" />
      </div>
      <div className="register-form">
        <h2>Registro</h2>
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
            type="email"
            name="correo"
            placeholder="Correo electrónico"
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
          <input
            type="file"
            name="foto"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <button type="submit">Registrar</button>
        </form>
        {message && <p>{message}</p>}
        <button className="login-button" onClick={() => navigate('/')}>
          Volver al Login
        </button>
      </div>
    </div>
  );
}

export default Register;
