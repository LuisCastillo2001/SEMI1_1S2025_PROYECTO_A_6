import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import filesImage from '../Images/files.png';

//cognito
import { Amplify } from 'aws-amplify';
import { signUp } from '@aws-amplify/auth';
import { awsExports } from '../cognitoConfig';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

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
  
  const isPasswordValid = (password) => {
    // Lista de caracteres especiales permitidos
    const specialChars = `^$*.[]{}()?"!@#%&/\\,><':;|_~\`+=-`;
  
    // Requisitos básicos
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = new RegExp(`[${specialChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}]`).test(password);
    
    // Verifica si hay espacios iniciales o finales
    const noLeadingOrTrailingSpaces = password === password.trim();
  
    // Si hay espacios internos, están permitidos (solo si no están al inicio o final)
    return (
      hasMinLength &&
      hasNumber &&
      hasLowercase &&
      hasUppercase &&
      hasSpecialChar &&
      noLeadingOrTrailingSpaces
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar la contraseña
    if (!isPasswordValid(formData.contrasenia)) {
      let msg = `Requisitos:

8: longitud mínima de caracteres
Contiene al menos 1 número
Contiene al menos una letra minúscula
Contiene al menos una letra mayúscula
Contiene al menos 1 carácter especial del siguiente conjunto o un carácter de espacio que no es inicial ni final.
^ $ * . [ ] { } ( ) ? - " ! @ # % & / \ , > < ' : ; | _ ~  + =`;
      setMessage(msg);
      return;
    }

    try{
      //Primero se registra el usuario en la base de datos
      const formDataToSend = new FormData();
      formDataToSend.append('nombre_usuario', formData.nombre_usuario);
      formDataToSend.append('correo', formData.correo);
      formDataToSend.append('contrasenia', formData.contrasenia);
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }
      
      const response = await fetch('http://localhost:3000/api/registrar_usuario', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Error al registrar usuario en la base de datos');
        return; // Detiene la ejecución, NO registra en Cognito
      }

      // Si el registro en la base de datos fue exitoso, registramos en Cognito
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: formData.correo, // Cognito usa el correo como username
        password: formData.contrasenia,
        options: {
          userAttributes: {
            email: formData.correo, // Campo obligatorio en Cognito
          },
          autoSignIn: false, // Inicia sesión automáticamente después del registro
        },
      });
      console.log('Usuario registrado en Cognito');

      // Mostrar mensaje y redirigir
      setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);

      }catch (error) {
        console.error('Error durante el registro:', error);
        setMessage(error.message || 'Error al registrar usuario');
      }
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
