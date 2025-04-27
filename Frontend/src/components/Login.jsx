import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import filesImage from '../Images/files.png';

// Cognito
import { signIn } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth'; //Para prueba 

const handleLogout = async () => {
  try {
    await signOut(); // Cierra la sesión en Cognito
    localStorage.removeItem('user'); // Opcional: Limpia los datos del usuario en localStorage
    localStorage.removeItem('token'); // Opcional: Limpia el token JWT si lo guardaste
    console.log('Sesión cerrada exitosamente.');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    console.log('Error al cerrar sesión. Intenta nuevamente.');
  }
};

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
      //await handleLogout(); // Cierra sesión antes de iniciar sesión nuevamente
      
      // Paso 1: Verificar credenciales en la base de datos
      const response = await fetch('http://localhost:3000/api/iniciar_sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (data && data[0].id_usuario) {
          localStorage.setItem('user', JSON.stringify(data[0]));
          setMessage('Credenciales verificadas -> Validando sesión...');
          
          // Paso 2: Iniciar sesión en Cognito
          try {
            // const username = formData.correo.trim(); // Cognito lo toma como username
            // const password = formData.contrasenia;
            // const cognitoUser = await signIn({ username, password});
            // console.log('Usuario autenticado en Cognito:', cognitoUser);

            // // Obtener el token JWT
            // const { tokens } = await fetchAuthSession();
            // const idToken = tokens?.idToken?.toString();
            // localStorage.setItem('token',idToken);
            // //console.log('Token JWT:', idToken);
//descomentar
            // Redirigir al dashboard
            setMessage('Inicio de sesión exitoso.');
            setTimeout(() => navigate('/dashboard'), 1000);
          } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setMessage('Error al iniciar sesión. Intenta nuevamente.');
          }
        } else {
          setMessage('Credenciales incorrectas');
        }
      } else {
        setMessage('Error al conectarse al servidor');
      }

    } catch (error) {
      console.error('Error al iniciar sesión en Cognito:', cognitoError);
      setMessage('Error al iniciar sesión en Cognito. Verifica tus credenciales.');
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
            placeholder="Ingresa el correo"
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
